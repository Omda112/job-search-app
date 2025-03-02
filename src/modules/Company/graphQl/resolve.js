import { accessRoles, companyModel, role } from "../../../DB/models/index.js";
import { authGraph } from "../../../middleware/auth.js"

export const getAllCompanie = async () => {
    return await companyModel.find();
};

export const banCompanyQuery = async (_, args) => {
    return await companyModel.findOneAndUpdate(
        { _id: args.id },
        { bannedAt: Date.now() },
        { new: true }
    );
};

export const unbanCompanyQuery = async (_, args) => {
    return await companyModel.findOneAndUpdate(
        { _id: args.id },
        { bannedAt: null },
        { new: true }
    );
};


export const approvedByAdmin = async (_,args) => {
    const { authorization } = args;
    const user = await authGraph({authorization , accessRoles:[accessRoles.admin]})
    return await companyModel.findByIdAndUpdate(
        { _id: args.id },
        { approvedByAdmin: true },
        { new: true }
    );
};
