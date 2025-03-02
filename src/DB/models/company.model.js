
import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    companyName: { 
        type: String, 
        unique: true, 
        required: [true, "Company name is required"] 
    },
    description: { 
        type: String, 
        // required: [true, "Description is required"] 
    },
    industry: { 
        type: String, 
        // required: [true, "Industry is required"] 
    },
    address: { 
        type: String, 
        // required: [true, "Address is required"] 
    },
    numberOfEmployees: { 
        type: Number, 
        required: true 
    },
    companyEmail: { 
        type: String, 
        unique: true, 
        required: [true, "Company email is required"], 
        lowercase: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    logo: { 
        secure_url: { type: String }, 
        public_id: { type: String } 
    },
    coverPic: { 
        secure_url: { type: String }, 
        public_id: { type: String } 
    },
    HRs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    bannedAt: { 
        type: Date, 
        default: null 
    },
    deletedAt: { 
        type: Date, 
        default: null 
    },
    legalAttachment: { 
        secure_url: { type: String }, 
        public_id: { type: String } 
    },
    approvedByAdmin: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

export const companyModel = mongoose.model("Company", companySchema) || mongoose.model.Company;
