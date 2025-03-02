import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const addCompanySchema = Joi.object({
        companyName: Joi.string().required(),
        address: Joi.string(),
        companyEmail: Joi.string().email().required(),
        description: Joi.string().min(30),
        industry: Joi.string(),
        numberOfEmployees: Joi.number().integer().min(1).max(1000),
}).required()


export const updateCompanySchema = Joi.object({
    companyName: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    industry: Joi.string().min(3).max(50),
    address: Joi.string().max(200),
    numberOfEmployees: Joi.number().integer().min(1),
    companyEmail: Joi.string().email(),
    legalAttachment: Joi.forbidden(),
    id: generalRules.objectId
});


export const searchByNameSchema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
}).required()