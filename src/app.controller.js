import  connectionDB from "./DB/connectionDB.js"
import companyRouter from "./modules/Company/company.controller.js"
import jobRouter from "./modules/Jobs/job.controller.js"
// import messageRouter from "./modules/messages/message.controller.js"
import userRouter from "./modules/Users/user.controller.js"
import { globalErrorHandler } from "./utils/error/index.js"
import cors from "cors"
import path from "path"
// import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/http';
import { schema } from "./modules/graph.schema.js"
import createSuperAdmin from "./utils/createSuperAdmin/index.js"



const bootstrap = async (app,express)=>{
    await connectionDB()
    await createSuperAdmin();
    app.use(cors());

    app.use('/graphql',createHandler({schema}));
      

    // upload file   عشان اقدر اتعامل مع الملفات الثابتة عندي كلينك اقدر اروحله زي كده  : http://localhost:3000/uploads/generals/amgDScreenshot%20(1).png
    app.use("/uploads", express.static(path.resolve("src/uploads")));

    app.use(express.json())

    // home page
    app.get('/',(req,res,next)=>{
        return res.status(200).json({msg:"hello from social app!"});
    })

    // app routes
    app.use("/users",userRouter)
    app.use("/companies",companyRouter)
    app.use("/jobs",jobRouter)


   


    app.use("*",(req,res,next)=>{
        return next(new Error("not founded"),{cause:404})
    })
    
    // error handling middleware
    app.use(globalErrorHandler)
}

export default bootstrap;