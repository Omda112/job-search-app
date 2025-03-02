// import { date } from "joi";
import cloudinary from "../../cloudinary/index.js";
import { companyModel } from "../../DB/models/index.js";
import { syncHandler } from "../../utils/index.js";

//-------------------------------- addCompany  --------------------------------
export const addCompany = syncHandler(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    
    const existingCompany = await companyModel.findOne({
        $or: [{ companyName }, { companyEmail }]
    });

    if (existingCompany) {
        return next(new Error("Company with this name or email already exists", { cause: 409 }));
    }

    const companyData = {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy: req.user._id
    };

    const company = await companyModel.create(companyData);
    res.status(201).json({ msg: "done", company });
});


//-------------------------------- updateCompany  --------------------------------

export const updateCompany = syncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, legalAttachment } = req.body;

    let company = await companyModel.findById(id);

    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to update this company", { cause: 401 }));
    }

    const updatedData = {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail
    };

    company = await companyModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ msg: "done", company });
});


//-------------------------------- softDeleteCompany  --------------------------------

export const softDeleteCompany = syncHandler(async (req, res, next) => {
    const { id } = req.params;

    let company = await companyModel.findById(id);

    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to delete this company", { cause: 401 }));
    }

    company = await companyModel.findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true });

    res.json({ msg: "done" });
});

// 5 -------------------------------- searchForCompanyWithName  --------------------------------
export const searchCompany = syncHandler(async (req, res, next) => {
    const { name } = req.query;

    if (!name) {
        return next(new Error("Please provide a company name to search", { cause: 400 }));
    }

    const companies = await companyModel.find({
        companyName: { $regex: name, $options: "i" }
    });

    res.json({ msg: "done", companies });
});

// 6 -------------------------------- Upload company logo  --------------------------------

export const uploadCompanyLogo = syncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) {
        return next(new Error("No file uploaded", { cause: 400 }));
    }

    const company = await companyModel.findById(id);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to upload logo for this company", { cause: 401 }));
    }

    if (company.logo?.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "companies"
    });

    company.logo = { secure_url, public_id };
    await company.save();

    res.status(201).json({ msg: "done", company });
});


// 7 -------------------------------- upload company coverPic  --------------------------------
export const uploadCompanyCover = syncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) {
        return next(new Error("No file uploaded", { cause: 400 }));
    }

    const company = await companyModel.findById(id);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to upload cover pic for this company", { cause: 401 }));
    }

    if (company.coverPic?.public_id) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: "companies/covers"
    });

    company.coverPic = { secure_url, public_id };
    await company.save();

    res.status(201).json({ msg: "done", company });
});

// 8 ------------------------------- delete company logo ------------------------
export const deleteCompanyLogo = syncHandler(async (req, res, next) => {
    const { id } = req.params;

    const company = await companyModel.findById(id);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to delete logo for this company", { cause: 401 }));
    }

    if (!company.logo?.public_id) {
        return next(new Error("No logo found for this company", { cause: 400 }));
    }

    await cloudinary.uploader.destroy(company.logo.public_id);

    company.logo = null;
    await company.save();

    res.status(200).json({ msg: "Company logo deleted successfully", company });
});


// 9 ------------------------------- delete company coverPic ------------------------
export const deleteCompanyCover = syncHandler(async (req, res, next) => {
    const { id } = req.params;

    const company = await companyModel.findById(id);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized to delete cover pic for this company", { cause: 401 }));
    }

    
    if (!company.coverPic?.public_id) {
        return next(new Error("No cover pic found for this company", { cause: 400 }));
    }

    await cloudinary.uploader.destroy(company.coverPic.public_id);

    company.coverPic = null;
    await company.save();

    res.status(200).json({ msg: "Company cover pic deleted successfully", company });
});

