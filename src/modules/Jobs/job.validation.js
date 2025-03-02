import Joi from "joi";
import { locations, workingTime } from "../../DB/models/index.js";
import { generalRules } from "../../utils/index.js";

export const addJobSchema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        location: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(30).max(1000).required(),
        technicalSkills: Joi.array().items(Joi.string().min(2).max(50)).min(1).required(),
        softSkills: Joi.array().items(Joi.string().min(2).max(50)).min(1).required(),
        workingTime: Joi.string().valid(workingTime.fullTime,workingTime.partTime).required(),
        companyId: Joi.string().hex().length(24).required(),
});

export const updateJobSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    location: Joi.string().min(3).max(100).valid(locations.onSight,locations.remotly,locations.hybrid),
    description: Joi.string().min(30).max(1000),
    technicalSkills: Joi.array().items(Joi.string().min(2).max(50)).min(1),
    softSkills: Joi.array().items(Joi.string().min(2).max(50)).min(1),
    workingTime: Joi.string().valid(workingTime.fullTime, workingTime.partTime),
    jobId:generalRules.objectId
});