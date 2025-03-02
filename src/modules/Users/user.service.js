// import messageModel from "../../DB/models/message.model.js";
import {providerTypes, userModel} from "../../DB/models/index.js"
import { syncHandler , eventEmitter , hash , compare , encrypt , decrypt , generateToken , verifyToken } from "../../utils/index.js"
import {OAuth2Client} from 'google-auth-library';
import cloudinary from "../../cloudinary/index.js";
import { decodedToken, tokenTypes } from "../../middleware/auth.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
// import { date } from "joi";
// import jwt from "jsonwebtoken" مش هنستخدمها عشان احنا عاملين verify token اصلا متنسااااش !!!

// ------------------------------ signUp  ----------------------------------
export const signUp = syncHandler(async (req, res, next) => {
    const { email, name, password, cPassword, phone, gender } = req.body;
    console.log(gender);
    
    if (password !== cPassword) {
        return next(new Error("Password does not match", { cause: 400 }));
    }

    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
        return next(new Error("Email already exists", { cause: 409 }));
    }

    // if(!req?.file){
    //     return next(new Error("Please upload a file", { cause: 400 }));
    // }
//---------------------------------------------------------------- لو هرفع اكتر من فايل local
    // let arrPaths = []
    // console.log("req.files :" , req.files);
    
    // for(const file of req.files){
    //     arrPaths.push(file.path);
    // }
//-----------------------------------------------------------------
    // console.log(arrPaths);
    
    // const {secure_url , public_id } = await cloudinary.uploader.upload(req.file.path,{
    //     resource_type: "video",
    //     folder: "users",
    // })



    // const Data = await cloudinary.uploader.upload(req.file.path,{
    //     resource_type: "video",
    //     folder: "users",
    // })


    // لو هشتغل علي fields
    // if(!req.files){
    //     return next(new Error("Please upload a profile picture", { cause: 400 }));
    // }
    // for(const file of req.files.attachments){
    //     arrPaths.push(file.path)
    // }


    // طب لو فع الصورة.... هبقي عايز اخزن المسار بتاعها عشان مينفعش اخزنها هي في الداتا بيز عشان المساحة


    const hashedPassword = await hash({ key: password, SALT_ROUNDS: process.env.SALT_ROUNDS });
    const encryptedPhone = await encrypt({ key: phone, SECRET_KEY: process.env.SECRET_KEY });
    
    eventEmitter.emit('sendEmailConfirmation', { email });

    // const user = await userModel.create({ email , name, password: hashedPassword, phone: encryptedPhone, gender , image: { secure_url , public_id } , provider:"system" });
    const user = await userModel.create({ email , name, password: hashedPassword, phone: encryptedPhone, gender, provider:"system" });
    return res.status(201).json({ msg: "doneeee", user });
});



// ------------------------------ confirmEmail  ----------------------------------

export const confirmOtp = syncHandler(async (req, res, next) => {
    const { email , code , type } = req.body;
   
    //check email
    const user = await userModel.findOne({ email , confirmed : false });
    
    if (!user) {
        return next(new Error("User not found or already confirmed", { cause: 404 }));
    }
    
    //check otp expiration
    const otpRecords = user.otp
        .filter(otp => otp.type === type)
    const lastOtp = otpRecords.at(-1);
    console.log("lastOtp :",lastOtp);
    
    const expiresInMinutes = (lastOtp.expiresIn.getTime() - Date.now()) / (1000 * 60)
    if (expiresInMinutes > 10) {
        return next(new Error("Expired email confirmation code", { cause: 401 }));
    }

    
    //compare code
    if(!await compare({key:code,hashed:lastOtp.code})){
    return next(new Error("Invalid code", { cause: 401 }));
    }

    //update user
    await userModel.findByIdAndUpdate(user._id, { confirmed: true ,  $pull: { otp: { type } }});
    return res.status(201).json({ msg: "done"});
});


// ------------------------------ signIn  ----------------------------------

export const signIn = syncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    const user = await userModel.findOne({ email, confirmed: true });
    console.log("user from signIn",user);
    
    if (!user) {
        return next(new Error("Email not found or not confirmed", { cause: 404 }));
    }
    
    if(!user.password){
        return next(new Error("email signed with goagle not system", { cause: 400 }));
    }
    
    const isMatch = await compare({key:password, hashed:user.password});
    
    if (!isMatch) {
        return next(new Error("Password is incorrect", { cause: 401 }));
    }
    console.log(user._id);
    
    // ------------ generate token ------------
    const accessToken = await generateToken({
        payload:{
            email,
            id: user._id,
        },
        SIGNATURE : user.role === "user" ? process.env.ACCESS_SIGNATURE_USER : process.env.ACCESS_SIGNATURE_ADMIN,
        option: { expiresIn : "1h"},
    })

    const refreshToken = await generateToken({
        payload:{
            email,
            id: user._id,
        },
        SIGNATURE : user.role === "user" ? process.env.REFRESH_SIGNATURE_USER : process.env.REFRESH_SIGNATURE_ADMIN,
        option: {expiresIn : "7d"},
    })

    return res.status(201).json({ msg: "done", token:{
        accessToken,
        refreshToken
    } });
});

// ------------------------------ signUpGmail  ----------------------------------

export const loginWithGmail = syncHandler(async (req, res, next) => {
    
    
    const { idToken } = req.body;

    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID, 
          });
          const payload = ticket.getPayload();
          return payload;
    }
    
    const { email , email_verified , picture , name } = await  verify()
    console.log(email)
    let user = await userModel.findOne({ email})
    console.log(user);
    
    if(user){
        return next(new Error("User already exists", { cause: 401 }));
    }

    user = await userModel.create({
        email,
        name,
        imgae: picture,
        confirmed: email_verified,
        provider:providerTypes.google,
    })


    if(user.provider != providerTypes.google){
        return next(new Error("User already linked with another provider (system)", { cause: 401 }));
    }


    return res.status(201).json({ msg: "done", user});
});

// ------------------------------ signInGmail  ----------------------------------

export const signInGmail = syncHandler(async (req, res, next) => {
        
    
    const { idToken } = req.body;

    const client = new OAuth2Client();
    async function verify() {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID, 
      });
      const payload = ticket.getPayload();
      return payload;
    }
    console.log(client);
    
    const { email , email_verified , picture , name } = await  verify()
    let user = await userModel.findOne({ email})
    if(!user){
        return next(new Error("user not found", {cause:404}));
    }

    if(user.provider != providerTypes.google){
        return next(new Error("User already linked with another provider (system)", { cause: 401 }));
    }

     // ------------ generate token ------------
     const accessToken = await generateToken({
        payload:{
            email,
            id: user._id,
        },
        SIGNATURE : user.role === "user" ? process.env.ACCESS_SIGNATURE_USER : process.env.ACCESS_SIGNATURE_ADMIN,
        option: { expiresIn : "1h"},
    })

    const refreshToken = await generateToken({
        payload:{
            email,
            id: user._id,
        },
        SIGNATURE : user.role === "user" ? process.env.REFRESH_SIGNATURE_USER : process.env.REFRESH_SIGNATURE_ADMIN,
        option: {expiresIn : "7d"},
    })

    return res.status(201).json({ msg: "done", token:{
        accessToken,
        refreshToken
    }});
});


// ------------------------------ forgetPassword  ----------------------------------

export const forgetPassword = syncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email , isDeleted: false });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    eventEmitter.emit("forgetPassword",{email})
    
    return res.status(201).json({ msg: "done"});
});


// ------------------------------ resetPassword  ----------------------------------
export const resetPassword = syncHandler(async (req, res, next) => {
    const { email , code ,type, newPassword } = req.body;

    const user = await userModel.findOne({ email , isDeleted: false });

    // check email
    if (!user) {
        return next(new Error("Email not found", { cause: 404 }));
    }

    //check otp expiration
    const otpRecords = user.otp
        .filter(otp => otp.type === type)
    const lastOtp = otpRecords.at(-1);
    console.log(lastOtp);

    // compare code
    if(!await compare({key:code, hashed:lastOtp.code})){
        return next(new Error("Invalid code", { cause: 401 }));
    }

    
    
    const expiresInMinutes = (lastOtp.expiresIn.getTime() - Date.now()) / (1000 * 60)
    if (expiresInMinutes > 10) {
        return next(new Error("Expired email confirmation code", { cause: 401 }));
    }

    // hash password عشان الباسورد الجديد
    const hashedPassword = await hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS });

    // update user
    // ممكن ميكونش عمل confirmed بعد الباسورد الجديد
    await userModel.findByIdAndUpdate(user._id, { password:hashedPassword ,confirmed: true ,  $pull: { otp: { type } }});
    return res.status(201).json({ msg: "done"});
});


// ------------------------------ refreshToken  ----------------------------------

export const refreshToken = syncHandler(async (req, res, next) => {
    const { authorization } = req.body;

    if (!authorization) {
            return next(new Error("Token not found"));
        }
    
        const existUser = await decodedToken({authorization , tokenType: tokenTypes.refreshToken , next})

        const accessToken = await generateToken({
            payload:{
                email:existUser.email,
                id: existUser._id,
            },
            SIGNATURE : existUser.role === "user" ? process.env.ACCESS_SIGNATURE_USER : process.env.ACCESS_SIGNATURE_ADMIN,
            option: { expiresIn : "1d"},
        })

        return res.status(201).json({ msg: "done", token:{
            accessToken
        } });
});

// ------------------------------ updateProfile  ----------------------------------

export const updateProfile = syncHandler(async (req, res, next) => {

    if(req.body?.phone){
        const phone = await encrypt ({ key :req.body.phone, SECRET_KEY:process.env.SECRET_KEY})
    }

    // if(req.file){
    //     await cloudinary.uploader.destroy(req.user.image)
    //     const { secure_url , public_id } = await cloudinary.uploader.upload(req.file.path , {
    //         folder: "users",
    //     })
    //     req.body.image = { secure_url , public_id }
    // }

    const user = await userModel.findByIdAndUpdate(req.user._id, req.body ,{new:true});
    return res.status(201).json({ msg:"done", user})
})


// ------------------------------ getProfile  ----------------------------------

export const getProfile = syncHandler(async (req, res, next) => {
    console.log("hello from getProfile",req.user);
    const user = await userModel.findById(req.user._id)
    console.log(user);
    
    const phone = await decrypt({ key: req.user.phone, SECRET_KEY: process.env.SECRET_KEY });

    return res.status(200).json({ msg: "done", user: { ...user.toObject(), phone } });
});


// ------------------------------ getProfileForAnotherUser  ----------------------------------

export const getProfileForAnotherUser = syncHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = await userModel.findById(id).select({ name: 1, phone: 1, profilePic: 1, coverPic: 1 });
    const phone = await decrypt({ key:user.phone , SECRET_KEY:process.env.SECRET_KEY })
    return res.status(201).json({ msg: "done", user: { ...user.toObject() , phone} });
});



// ------------------------------ updatePassword  ----------------------------------
export const updatePassword = syncHandler(async (req, res, next) =>{
    const { oldPassword, newPassword } = req.body;
    const checkPassword = await compare({key: oldPassword, hashed:req.user.password});
    
    if(!checkPassword){
        return next(new Error("Old password is incorrect", { cause: 401 }));
    }

    const hashed = await hash({ key: newPassword  , SALT_ROUNDS : process.env.SALT_ROUNDS});

    const user = await userModel.findByIdAndUpdate(req.user._id , {password:hashed ,changeCredentialTime: Date.now()} ,{new:true});
    return res.status(201).json({ msg:"done", user})
})

// ------------------------------ uploadProfilePic  ----------------------------------

export const uploadProfilePic = syncHandler(async (req, res, next) => {
    if(req.file){
        if (req.user?.profilePic?.length > 0) {
            await cloudinary.uploader.destroy(req.user.profilePic[0].public_id);
        }        
        const { secure_url , public_id } = await cloudinary.uploader.upload(req.file.path , {
            folder: "users",
        })
        console.log(secure_url , public_id);
        console.log(req.user);
        
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { profilePic: [{ secure_url, public_id }] }, { new: true });
        return res.status(201).json({ msg:"done", user: updatedUser });
    }else{
        return next(new Error("No file uploaded", { cause: 400 }));
    }
});


// ------------------------------ uploadCoverPic  ----------------------------------

export const uploadCoverPic = syncHandler(async (req, res, next) => {
    if(req.file){
        if (req.user.coverPic?.length > 0) {
            await cloudinary.uploader.destroy(req.user.coverPic[0].public_id);
        }        
        const { secure_url , public_id } = await cloudinary.uploader.upload(req.file.path , {
            folder: "users",
        })
        console.log(secure_url , public_id);
        
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { coverPic: [{ secure_url, public_id }] }, { new: true });
        return res.status(201).json({ msg:"done", user: updatedUser})
    }else{
        return next(new Error("No file uploaded", { cause: 400 }));
    }
});

// ------------------------------ deleteProfilePic  ----------------------------------
export const deleteProfilePic = syncHandler(async(req,res,next)=>{
    if(req.user.profilePic?.length > 0){
        await cloudinary.uploader.destroy(req.user.profilePic[0].public_id);
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { profilePic: [] }, { new: true });
        return res.status(201).json({ msg:"done", user: updatedUser})
    }else{
        return next(new Error("No profile picture to delete", { cause: 400 }));
    }
})

// ------------------------------ deleteCoverPic  ----------------------------------
export const deleteCoverPic = syncHandler(async(req,res,next)=>{
    if(req.user.coverPic?.length > 0){
        await cloudinary.uploader.destroy(req.user.coverPic[0].public_id);
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { coverPic: [] }, { new: true });
        return res.status(201).json({ msg:"done", user: updatedUser})
    }else{
        return next(new Error("No cover picture to delete", { cause: 400 }));
    }
})

// ------------------------------ freezeAccount(softDelete)  ----------------------------------
export const freezeAccount = syncHandler(async (req, res, next) =>{
    // هسيب ال  passwordchangeat عشان مدام اتعمله delete يبقي الtoken  expired
    const user = await userModel.findByIdAndUpdate(req.user._id , {isDeleted: true ,passwordChangeAt: Date.now()} ,{new:true});
    return res.status(201).json({ msg:"done", user})
})



// ------------------------------ addFriend  ----------------------------------

export const addFriend = syncHandler(async (req, res, next) => {
    let {id} = req.params;
    console.log("hello");
    
    console.log(id);
    console.log(req.user._id);
    
    if(!id){
        return next(new Error("friend id not found", { cause: 400 }));
    }
    id = new mongoose.Types.ObjectId(String(id));
    console.log(id);
    
    // const user = await userModel.findByIdAndUpdate(id , {$addToSet: { friends: req.user._id}}, { new: true })
    const user = await userModel.findOneAndUpdate(
        {_id: id , isDeleted: false},
        { $addToSet: { friends: { userId: req.user._id } } },
        { new: true }
    )
    console.log("user that will added :",user);
    
    if (!user) {
        return next(new Error("User not found or deleted", { cause: 404 }));
    }
    await userModel.findOneAndUpdate(
        {_id:req.user._id , isDeleted: false},
        { $addToSet: { friends: {userId: new mongoose.Types.ObjectId(id)} } },
        { new: true }
    )
    return res.status(201).json({ msg: "done", user });
});


// ------------------------------ getTheSocketProfile  ----------------------------------

export const getTheSocketProfile = syncHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = await userModel.findOne(
        {_id:req.user._id , isDeleted:false},
    ).populate([
        {path:"friends"}
    ])
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }
    return res.status(201).json({ msg: "done", user });
});
//--------------------------------------------------------------------------------









// ------------------------------ getProfile  ----------------------------------

export const SHAREProfile = syncHandler(async (req, res, next) => {
    const messages = await messageModel.find({userId:req.user._id});
    const phone = await decrypt({ key:req.user.phone , SECRET_KEY:process.env.SECRET_KEY })
    return res.status(201).json({ msg: "done", user: req.user , messages });
});


// ------------------------------ SHAREProfile  ----------------------------------

export const shareAccount = syncHandler(async (req, res, next) => {
    console.log("req.user:", req.user);
    const {id} = req.params;
    const user = await userModel.findOne({_id:id , isDeleted:false});
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if(req.user._id.toString() === id) {
        return res.status(201).json({ msg: "done", user: req.user })
    }
    const emailExist = user.viewers.find(viewer => {
        return viewer.userId.toString() === req.user._id.toString()
    })
    if(emailExist){
        emailExist.time.push(Date.now());
        if(emailExist.time.length > 5){
           emailExist.time = emailExist.time.slice(-5) // هياخد 5 من الاخر يعني اخر 5 زيارات
        }
    }else{
        user.viewers.push({userId: req.user._id, time: [Date.now()]})
    }

    await user.save()

    return res.status(201).json({ msg: "done" , user })

});




// ------------------------------ shareAccount ----------------------------------
// export const shareAccount = syncHandler(async (req, res, next) =>{

//     const user = await userModel.findById(req.params.id).select("name email phone");
//     if(!user){
//         return next(new Error("User not found", { cause: 404 }));
//     }
//     return res.status(201).json({ msg:"done", user})
// })



