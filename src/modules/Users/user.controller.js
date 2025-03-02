import { Router } from "express";
import { addFriend, confirmOtp, deleteCoverPic, deleteProfilePic, forgetPassword, freezeAccount, getProfile, getProfileForAnotherUser, getTheSocketProfile, loginWithGmail, refreshToken, resetPassword, shareAccount, signIn, signInGmail, signUp, updatePassword, updateProfile, uploadCoverPic, uploadProfilePic } from "./user.service.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { confirmEmailSchema, forgetPasswordSchema, freezeAccountSchema, refreshTokenSchema, resetPasswordSchema, shareProfileSchema, signInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { accessRoles } from "../../DB/models/user.model.js";
import { fileTypes, multerHost } from "../../middleware/multer.js";


const userRouter = Router()
//هحط زي  label لاسم الفايل الللي عايز ارفعه 
// userRouter.post("/signUp",multerLocal(["image/png","image/jpeg"]).single("profileImage"),signUp)  لو سيبت ده كده هاجي بعدين عشان اعدل هعدل كل rout لوحدها فهنخليها dynamic
//userRouter.post("/signUp",multerLocal(fileTypes.image).single("profileImage"),signUp) طب افرض انا محتاجه يبعت صورة وفيديو
//userRouter.post("/signUp",multerLocal([...fileTypes.image,...fileTypes.video]).single("attachment"),signUp)........ برفع local
userRouter.post("/signUp",validation(signUpSchema),signUp)

// userRouter.post("/signUp",multerHost(fileTypes.video).single("attachment"),validation(signUpSchema),signUp) //........ برفع cloudinary
userRouter.post("/signIn",validation(signInSchema),signIn)

userRouter.patch("/confirmEmail",validation(confirmEmailSchema),confirmOtp)

userRouter.get("/refreshToken",validation(refreshTokenSchema),refreshToken)

userRouter.patch("/forgetPassword",validation(forgetPasswordSchema),forgetPassword)

userRouter.patch("/resetPassword",validation(resetPasswordSchema),resetPassword)

userRouter.post("/loginWithGmail",loginWithGmail)

userRouter.post("/signInGmail",signInGmail)

userRouter.patch("/updateProfile",authentication,validation(updateProfileSchema),updateProfile)

userRouter.get("/getProfile",authentication,authorization(Object.keys(accessRoles)),getProfile)

userRouter.get("/profile",authentication,getTheSocketProfile)

userRouter.get("/getProfileForAnotherUser/:id",getProfileForAnotherUser)

userRouter.patch("/updateProfile/password",authentication,validation(updatePasswordSchema),updatePassword)

userRouter.patch("/uploadProfilePic",authentication,multerHost(fileTypes.image).single("attachment"),uploadProfilePic)

userRouter.patch("/uploadCoverPic",authentication,authorization(accessRoles.user),multerHost(fileTypes.image).single("attachment"),uploadCoverPic)

userRouter.delete("/deleteProfilePic",authentication,authorization(accessRoles.user),deleteProfilePic)

userRouter.delete("/deleteCoverPic",authentication,authorization(accessRoles.user),deleteCoverPic)

userRouter.delete("/freeze",authentication,validation(freezeAccountSchema),freezeAccount)


userRouter.patch("/addFriend/:id",authentication,addFriend)

// userRouter.patch("/updateProfile",multerHost(fileTypes.image).single("attachment"),validation(updateProfileSchema),authentication,updateProfile)
// userRouter.get("/share/:id",validation(shareProfileSchema),authentication,shareAccount)






export default userRouter;