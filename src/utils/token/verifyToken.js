import jwt from 'jsonwebtoken'

export const verifyToken = async ({token , SIGNATURE_CONFIRMATION})=>{
    return jwt.verify(token, SIGNATURE_CONFIRMATION);
}