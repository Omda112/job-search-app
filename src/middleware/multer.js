import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
// هو اصلا middleware بالتالي مش هحطله req , res , next

// طب ليه عاملها function ? عشان ابعتلها data من اي حتة بدل ما كاتبها من الاول في كل مكان هبعت فيه 

// customValidation عشان مثبتش نوع الفايل اللي هيجيلي علي كل ال routes ................................

// ده اللي هستخدمه عشان اخلي استقبال ال routes dynamic
export const fileTypes = {
    image:['image/jpeg' , 'image/png' , 'image/gif'],
    video:['video/mp4'],
    audio:['audio/mp3'],
    pdf:['application/pdf']
}
export const multerLocal = (customValidation = [], customPath = "generals")=>{

    const fullPath = path.resolve("./src/uploads/",customPath);
    if(!fs.existsSync(fullPath)){
        // recursive : true عشان لو ملقاش ال path من اوله نروح نعمله create
        fs.mkdirSync(fullPath , { recursive: true});
        console.log(`Directory ${fullPath} created.`);
    }


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // في حالة ان مفيش ايرور ارفع في ال upload
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            // في حالة انه مفيش ايرور ارفع اسم الفايل اللي عندي عالجهاز
           // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) مش هستخدمه عشان ميكونش طويل اوي
            cb(null, nanoid(4) +   file.originalname);
        },
    });

    function fileFilter(req, file, cb) {
        console.log("Received file mimetype:", file.mimetype);
        console.log("Allowed types:", customValidation);
    
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log(" File type not allowed!");
            cb(new Error("File type not allowed!"), false);
        }
    }
    
    const upload = multer({ fileFilter , storage})
    return upload
}

export const multerHost = (customValidation = []) => {
    console.log("hello from multer host");
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        console.log(req.file);
        console.log("Received file:", file);
        console.log("Allowed types:", customValidation);
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed!"), false);
        }
    }    
    const upload = multer({ fileFilter , storage});
    return upload
};