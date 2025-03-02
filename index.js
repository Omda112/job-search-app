import dotenv from 'dotenv';
import path from 'path';
import express from "express"
import bootstrap from "./src/app.controller.js"
import { Server } from 'socket.io';
import { userModel } from './src/DB/models/user.model.js';
// import { authSocket } from './src/middleware/auth.js';
import { runIo } from './src/modules/chat/chat.socket.js';
dotenv.config({path: path.resolve('src/config/.env')});
const app = express()
const port = process.env.PORT || 3001


bootstrap(app,express)

const server = app.listen(port,()=>{
    console.log("sever connected on port 3000");
})

runIo(server)