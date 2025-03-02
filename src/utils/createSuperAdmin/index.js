import { userModel } from "../../DB/models/index.js";
import { hash } from "../encryption/hash.js"; 

const createSuperAdmin = async () => {
    const existingAdmin = await userModel.findOne({ role: "admin" });

    if (!existingAdmin) {
        const hashedPassword = await hash({key:"Admin@123", SALT_ROUNDS:12});
        const adminUser = await userModel.create({
            name:{
                first: "Emad El-Din",
                last: "Ihab",
            },
            email: "emadehab467@gmail.com",
            password: hashedPassword,
            role: "admin",
            phone:"01212926335",
            confirmed: true,
        });
        console.log("Super Admin created successfully!");
    }
};

export default createSuperAdmin;
