import bcrypt from "bcrypt"

export const hash = async ({key,SALT_ROUNDS = process.env.SALT_ROUNDS})=>{
    
    return bcrypt.hash(key,Number(SALT_ROUNDS));
}

