
import mongoose from "mongoose";

export const locations={
    onSight:"onSight",
    remotly:"remotly",
    hybrid:"hybrid"
}

export const workingTime = {
    fullTime:"fullTime",
    partTime:"partTime",
}

export const seniorityLevel = {
    fresh:"fresh",
    Junior:"Junior",
    Mid_Level:"Mid-Level",
    Senior:"Senior",
    Team_Lead:"Team_Lead",
    CTO:"CTO"
}

const jobSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },
    location:{
        type:String,
        enum:Object.values(locations),
        default:locations.onSight,
        required:true
    },
    technicalSkills: {
        type: [String], 
        required: true
    },
    softSkills: {
        type: [String], 
        required: true
    },
    addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    updatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    workingTime:{
        type:String,
        enum:Object.values(workingTime),
        default:workingTime.fullTime,
        required:true
    },
})

export const jobModel = mongoose.model("Job",jobSchema) || mongoose.model.Job;