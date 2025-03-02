import Joi  from "joi";
import { generalRules } from "../../utils/generalRules/index.js";
import { enumGender } from "../../DB/models/user.model.js";

// import { connection } from "mongoose";




export const signUpSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(3).max(12).required(),
        last: Joi.string().min(3).max(12).required()
    }).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: generalRules.password.valid(Joi.ref("password")).required(),
    phone: Joi.string()
        .regex(/^01[0125][0-9]{8}$/)
        .min(10)
        .max(15)
        .required(),
    gender: Joi.string()
        .valid(enumGender.male, enumGender.female)
        .required(),
});


// headers: generalRules.Headers
     

export const confirmEmailSchema = Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().length(4).required(),
    type: Joi.string().valid("confirmEmail", "forgetPassword").required()
}).required()


export const signInSchema = Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required()
}).required()


export const refreshTokenSchema = Joi.object({
    authorization: Joi.string().required()
})


export const forgetPasswordSchema = Joi.object({
    email: generalRules.email.required()
}).required()


export const resetPasswordSchema = {
        email: generalRules.email.required(),
        code: Joi.string().length(4).required(),
        type: Joi.string().valid("confirmEmail", "forgetPassword").required(),
        newPassword: generalRules.password.required(),
        cPassword: generalRules.password.valid(Joi.ref("newPassword")).required()
};


export const updateProfileSchema =Joi.object({
        name: Joi.object({
            first: Joi.string().min(3).max(12).required(),
            last: Joi.string().min(3).max(12).required()
        }),
        phone: Joi.string().min(10).max(15).label("Phone"),
        gender: Joi.string().valid(enumGender.male, enumGender.female).label("Gender"),
        DOB: Joi.date().label("DOB"),
});


export const updatePasswordSchema =Joi.object({
        oldPassword: generalRules.password.required().label("oPassword"),
        newPassword: generalRules.password.required().label("nPassword"),
        cPassword: generalRules.password.valid(Joi.ref('newPassword')).required().label("cPassword"),
})
    

export const freezeAccountSchema =Joi.object({
    headers:generalRules.Headers
})


export const shareProfileSchema = {
    params: Joi.object({
       id:generalRules.objectId.required(),
    }).required(),
}