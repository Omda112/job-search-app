import { userModel } from "../../../DB/models/index.js"


export const getAllUser = async ()=>{
    const users = await userModel.find()
    return users;
}

export const bannUser = async (_,args)=>{
    const bannedUsers = await userModel.findByIdAndUpdate( args.id , { isBanned : true } , {new: true})
    return bannedUsers;
}

export const unbannUser = async (_,args)=>{
    const unbannedUsers = await userModel.findByIdAndUpdate( args.id , { isBanned : false } , {new: true})
    return unbannedUsers;
}