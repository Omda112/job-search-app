import { companyModel } from "../../DB/models/company.model.js";
import { jobModel } from "../../DB/models/job.model.js";
import { pagination } from "../../utils/features/index.js";
// import { paginaiton } from "../../utils/features/index.js";
import { syncHandler } from "../../utils/index.js";


//-------------------------------- addJob  ---------------------------------
export const addJob = syncHandler(async(req,res,next)=>{
    const { companyId } = req.params;
    const { title , location , description , technicalSkills , softSkills , workingTime } = req.body;

    // check if company is already exists
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    // chech if company is not deleted
    if(company?.deletedAt){
        return next(new Error("Company is deleted"),{cause:401});
    }

    // check if the company owner || hr
    console.log(req.user._id.toString(),company?.createdBy.toString());
    
    // check the hrs
    const hr = company.HRs.find((hr)=>{
        return hr.userId.toString() === req.user._id.toString();
    })
    if(company?.createdBy.toString()!== req.user._id.toString() && !hr){
        return next(new Error("You are not authorized to add a job for this company"),{cause:403});
    }

    // check if the job title already exists
    const jobExist = await jobModel.findOne({ title, companyId });
    if (jobExist) {
        return next(new Error("Job title already exists", { cause: 409 }));
    }

    // create new job and save it to the database
    const newJob = await jobModel.create({
        title,
        location,
        description,
        technicalSkills,
        softSkills,
        workingTime,
        companyId,
        addedBy:req.user._id
    });
    res.status(201).json({ msg: "done", job: newJob });
})

//-------------------------------- updateJob  ---------------------------------

export const updateJob = syncHandler(async(req,res,next)=>{
    const { jobId } = req.params;

    // check if job is already exists
    const job = await jobModel.findById(jobId);
    if (!job) {
        return next(new Error("Job not found", { cause: 404 }));
    }
    
    // check if the job owner
    console.log(req.user._id.toString(),job?.addedBy.toString());
    
    if(job?.addedBy.toString()!== req.user._id.toString()){
        return next(new Error("Unauthorized to update this job"),{cause:401});
    }
    
    // update the job
    const updatedJob = await jobModel.findByIdAndUpdate(jobId, req.body , { new: true });
    res.status(200).json({ msg: "done", job: updatedJob });
})

//-------------------------------- deleteJob  ---------------------------------

export const deleteJob = syncHandler(async(req,res,next)=>{
    const { jobId } = req.params;

    // check if job is already exists
    const job = await jobModel.findById(jobId);
    if (!job) {
        return next(new Error("Job not found", { cause: 404 }));
    }
    
    // check if the job owner
    console.log(req.user._id.toString(),job?.addedBy.toString());
    
    if(job?.addedBy.toString()!== req.user._id.toString()){
        return next(new Error("Unauthorized to delete this job"),{cause:401});
    }
    
    // delete the job
    await jobModel.findByIdAndDelete(jobId);
    res.status(200).json({ msg: "done" });
})

//-------------------------------- searchForJob  ---------------------------------

export const searchJob = syncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const { page } = req.query;
    const { name } = req.body;

    let id;

    if (companyId) {
        const company = await companyModel.findById(companyId);
        if (!company) {
            return next(new Error("Company not found", { cause: 404 }));
        }
        if (company?.deletedAt) {
            return next(new Error("Company is deleted", { cause: 401 }));
        }
        id = company._id;
    } 
    else if (name) {
        const company = await companyModel.findOne({ companyName: name });
        if (!company) {
            return next(new Error("Company not found", { cause: 404 }));
        }
        if (company?.deletedAt) {
            return next(new Error("Company is deleted", { cause: 401 }));
        }
        id = company._id;
    }

    console.log(id);

    const { data, _page, totalCount } = await pagination({ 
        page, 
        sort: "-createdAt", 
        model: jobModel, 
        filter: { companyId: id }, 
        populate: [{ path: "companyId" }]
    });

    res.status(200).json({ msg: "done", data, _page, totalCount });
});


//-------------------------------- delJob  ---------------------------------


//-------------------------------- getAllJobs  ---------------------------------
export const getAllJobs = syncHandler(async(req, res, next)=>{
    const { page } = req.query;

    if (Object.keys(req.body).length >= 0) {
        const { data, _page, totalCount } = await pagination({ 
            page, 
            sort: "-createdAt", 
            model: jobModel, 
            filter:  req.body , 
            populate: [{ path: "companyId" }]
        }); 
        return res.status(200).json({ msg: "done", data, _page, totalCount });
    }
    
    
    const jobs = await jobModel.find()
    return res.status(200).json({ msg: "done", data: jobs });
})

