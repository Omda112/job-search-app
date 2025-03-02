import Joi from "joi";
import { Types } from "mongoose";

export const customId = (value,helper)=>{
    let data = Types.ObjectId.isValid(value);
    return data ? true : helper.message("id is not a valid")
}

export const generalRules = {
    email : Joi.string().email({tlds: {allow:["com","outlook"]},minDomainSegments:2}).required(),
    password : Joi.string().min(8).required(),
    objectId : Joi.string().custom(customId),
    Headers:Joi.object({
        authorization: Joi.string().required(),
        'cache-control': Joi.string(),
        'postman-token': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        host: Joi.string(),
        accept: Joi.string(),
        'user-agent': Joi.string(),
        'accept-encoding': Joi.string(),
        connection: Joi.string(),
    }),
    file:Joi.object({
            fieldname:Joi.string().valid("attachment","attachments").required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().positive().required()
    })
}