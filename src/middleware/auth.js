import jwt from "jsonwebtoken";
// import userModel from "../DB/models/index.js"
import { syncHandler } from "../utils/error/index.js";
import { userModel } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/verifyToken.js";
import mongoose from "mongoose";

export const tokenTypes = {
    access : "access",
    refresh : "refresh",
}

export const decodedToken = async ({authorization , tokenType , next})=>{
    const [prefix, token] = authorization.split(" ") || [];

    if (!prefix || !token) {
        return next(new Error("Token not found"));
    }

    let ACCESS_SIGNATURE_TOKEN;
    let REFRESH_SIGNATURE_TOKEN;
    if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
        ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_ADMIN;
        REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_ADMIN;
    } else if (prefix === process.env.PREFIX_TOKEN_USER) {
        ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_USER;
        REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_USER;
    } else {
        return next(new Error("Invalid token format"));
    }

    const decoded = await verifyToken({
        token,
        SIGNATURE_CONFIRMATION: tokenType === tokenTypes.access?ACCESS_SIGNATURE_TOKEN : REFRESH_SIGNATURE_TOKEN
    });
    // console.log(decoded);
    // console.log("hello from auth",decoded);
    
    if (!decoded?.id) {
        return next(new Error("Invalid token payload"));
    }
    // console.log("Decoded ID Type:", typeof decoded.id);
    
    const existUser = await userModel.findById(decoded.id);
    // console.log("existUser :",existUser);
    
    if (!existUser) {
        return next(new Error("User not found"));
    }

    if(existUser?.isDeleted){
        return next(new Error("User is deleted"),{cause:401});
    }

    if((parseInt(existUser?.passwordChangeAt?.getTime()/1000) > decoded.iat)){
        return next(new Error("expired token Password has been changed"),{cause:401});
    }

    return existUser;;
}


export const authentication = syncHandler(async (req, res, next) => {
    const { authorization } = req.headers; 
    console.log(authorization);
    
    if (!authorization) {
        return next(new Error("Token not found"));
    }
    
    const user = await decodedToken({authorization,tokenType: tokenTypes.access , next})
    // console.log("user from auth",user);
    
    req.user = user;
    next();
});

export const authorization = (accessRoles = []) => {
    return syncHandler(async (req, res, next) => {
        // console.log(req.user);
        
        if (!req.user) {
            return next(new Error("Unauthorized access"));
        }
        // console.log(req.user.role);
        // console.log(accessRoles);
        
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("Access denied"));
        }

        next();
    });
};



export const authGraph = async ({authorization , tokenType = tokenTypes.access , accessRoles = []})=>{
    const [prefix, token] = authorization.split(" ") || [];

    if (!prefix || !token) {
        return next(new Error("Token not found"));
    }

    let ACCESS_SIGNATURE_TOKEN;
    let REFRESH_SIGNATURE_TOKEN;
    if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
        ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_ADMIN;
        REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_ADMIN;
    } else if (prefix === process.env.PREFIX_TOKEN_USER) {
        ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_USER;
        REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_USER;
    } else {
        throw new Error("Invalid token format");
    }

    const decoded = await verifyToken({
        token,
        SIGNATURE_CONFIRMATION: tokenType === tokenTypes.access?ACCESS_SIGNATURE_TOKEN : REFRESH_SIGNATURE_TOKEN
    });
    
    if (!decoded?.id) {
        throw new Error("Invalid token payload");
    }

    const existUser = await userModel.findById(decoded.id);
    if (!existUser) {
        throw new Error("User not found");
    }

    if(existUser?.isDeleted){
        throw new Error("User is deleted"),{cause:401};
    }

    if((parseInt(existUser?.passwordChangeAt?.getTime()/1000) > decoded.iat)){
        throw new Error("expired token Password has been changed"),{cause:401};
    }

    if (!accessRoles.includes(existUser.role)) {
        return next(new Error("Access denied"));
    }
    return existUser;;
}


export const authSocket = async ({ socket }) => {
    try {
        const [prefix, token] = socket?.handshake?.auth?.authorization?.split(" ") || [];

        if (!prefix || !token) {
            return { message: "Token not found", statusCode: 401 };
        }

        let ACCESS_SIGNATURE_TOKEN;
        let REFRESH_SIGNATURE_TOKEN;

        if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
            ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_ADMIN;
            REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_ADMIN;
        } else if (prefix === process.env.PREFIX_TOKEN_USER) {
            ACCESS_SIGNATURE_TOKEN = process.env.ACCESS_SIGNATURE_USER;
            REFRESH_SIGNATURE_TOKEN = process.env.REFRESH_SIGNATURE_USER;
        } else {
            return { message: "Invalid token format", statusCode: 400 };
        }

        const tokenType = tokenTypes.access;

        const decoded = await verifyToken({
            token,
            SIGNATURE_CONFIRMATION: tokenType === tokenTypes.access ? ACCESS_SIGNATURE_TOKEN : REFRESH_SIGNATURE_TOKEN
        });

        if (!decoded?.id) {
            return { message: "Invalid token payload", statusCode: 401 };
        }

        const existUser = await userModel.findById(decoded.id);
        if (!existUser) {
            return { message: "User not found", statusCode: 404 };
        }

        if (existUser.isDeleted) {
            return { message: "User is deleted", statusCode: 401 };
        }

        if (parseInt(existUser?.passwordChangeAt?.getTime() / 1000) > decoded.iat) {
            return { message: "Expired token - Password has been changed", statusCode: 401 };
        }

        // if (!accessRoles.includes(existUser.role)) {
        //     return { message: "Access denied", statusCode: 403 };
        // }

        return { message: "Authenticated successfully", statusCode: 200, user: existUser };

    } catch (error) {
        return { message: error.message || "Authentication error", statusCode: 500 };
    }
};


