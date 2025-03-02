import { Server } from "socket.io";
import { logOut, registerAccount } from "./chat.service.js";

export const runIo = async(server)=>{
    const io = new Server(server,{
        cors: {
            origin: "*",
        }
    })
    
    
    
    io.on('connection',async(socket)=>{
        await registerAccount({ socket });
        await logOut({socket});
        // console.log('a user connected');
        // socket.on('login', async (data) => {
        //     console.log(data);
        //     const user = await userModel.findOne({email: data.email})
        //     console.log(user);
        //     const {friends} = user.friends;
        //     console.log("friend",{...friends});
        //     socket.emit('friends',friends)
        //     console.log('user disconnected');
        // });
    
    })
}