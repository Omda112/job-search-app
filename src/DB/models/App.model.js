import mongoose from "mongoose";

export const status = {
    pending: "pending",
    accepted: "accepted",
    viewed: "viewed",
    in_consideration: "in consideration",
    rejected: "rejected"
 
}


const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userCV: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: "pending"
    }
}, {
    timestamps: true
});

export const ApplicationModel = mongoose.model("Application", applicationSchema) || mongoose.model.Application;
