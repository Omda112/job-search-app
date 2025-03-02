import mongoose from "mongoose";

const chatSchema = {
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages:[{
        message:{
            type:String,
        },
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }]
}

const chatModel = mongoose.model("Chat") || mongoose.model.Chat;