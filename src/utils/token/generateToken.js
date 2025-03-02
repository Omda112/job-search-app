import jwt from 'jsonwebtoken';

export const generateToken = async ({ payload = {}, SIGNATURE, option = {} }) => {
    console.log(SIGNATURE);
    console.log("Generated Access Token Payload:",
        payload.email,
        payload.id,
    );
    return jwt.sign(
        payload,
        SIGNATURE,
        option
    );
};
