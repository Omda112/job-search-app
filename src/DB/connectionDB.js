
import mongoose from "mongoose";

// console.log(process.env.port);


const connectionDB = async ()=>{
    await mongoose.connect(process.env.URI_CONNECTION)
    .then(()=>{
        console.log("connected to mongodb");
    }).catch((error)=>{
        console.log("failed connect to mongodb",error);
        
    })
}
export default connectionDB;
