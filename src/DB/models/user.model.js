// import { date } from "joi";
import mongoose from "mongoose";
// import { accessRoles } from "../../middleware/auth.js";
// import { string } from "joi";


export const enumGender = {
    male: "male",
    female: "female"
}

export const accessRoles = {
    user: "user",
    admin: "admin",
};

export const providerTypes = {
    system : "system",
    google: "google",
};

export const role = {
    owner: "owner",
    employee: "employee",
}

const userSchema = new mongoose.Schema({
    provider:{
        type:String,
        enum:Object.values(providerTypes),
        default:providerTypes.system
    },
    name: {
        first: {
            type: String,
            // required: [true, "First name is required"],
            lowercase: true,
            minLength: 3,
            maxLength: 15
        },
        last: {
            type: String,
            // required: [true, "Last name is required"],
            lowercase: true,
            minLength: 3,
            maxLength: 10
        }
    },    
    email:{
        type:String,
        required:true,
        lowercace:true,
        unique:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required: function(){
            return this.provider == providerTypes.google ? false : true;
        } ,
        minLength:8
    },
    gender:{
        type:String,
        required:true,
        enum:Object.values(enumGender),
        default:enumGender.male,
    },
    DOB:{
        type: Date,
    },
    phone:{
        type:String,
        required: function(){
            return this.provider == providerTypes.google ? false : true;
            },
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(accessRoles),
        default:accessRoles.user
    },
    deletedAt:{
        type:Date
    },
    bannedAt:{
        type:Date
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    // passwordChangeAt:Date,
    isDeleted:{
        type:Boolean,
        default:false
    },
    changeCredentialTime:{
        type: Date,
        default:null
    },
    // imgae:String, ده وانا برفع local
    //  coverImage:[String] local
    profilePic:[{ // عشان اقدر اتعامل مع اللي راجع من cloudinary
        secure_url:String,
        public_id:String,
    }],
    coverPic:[{
        secure_url:String,
        public_id:String,
    }],
    otp: [
        {
            code: { type: String, required: true },
            type: { 
                type: String, 
                enum: ["confirmEmail", "forgetPassword"], 
                required: true 
            },
            expiresIn: { type: Date, required: true }
        }
    ],
    // otpEmail:String,
    // otpPassword:String,
    viewers:[{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        time:[Date]
        }],
        isBanned: { type: Boolean, default: false },
        friends: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }]
},
    {
        timestamps: true,
    }
)

userSchema.virtual('name.full')
    .get(function () {
        return this.name.first + ' ' + this.name.last;
    })

export const userModel = mongoose.model("User",userSchema) || mongoose.model.User;

export const connectionUser = new Map();

// export default userModel;