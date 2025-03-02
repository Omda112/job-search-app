import { connectionUser } from "../../DB/models/index.js";
import { authSocket } from "../../middleware/auth.js";


export const registerAccount = async ({ socket }) => {
    console.log("hi from register " );
    
    if (!socket) {
        console.error("Socket is undefined in registerAccount");
        return;
    }

    const data = await authSocket({ socket });
    
    if (data.statusCode != 200) {
        return socket.emit("authError", data);
    }

    connectionUser.set(data.user._id.toString(), socket.id);
    console.log("/////////////////////",connectionUser);
    
    return "done";
};

export const logOut = async({socket})=>{
    return socket.on("disconnected",async()=>{
        console.log("hi from logout " );
        if (!socket) {
            console.error("Socket is undefined in registerAccount");
            return;
        }
    
        const data = await authSocket({ socket });
        
        if (data.statusCode != 200) {
            console.log("empty",connectionUser);
            return socket.emit("authError", data);
        }
        
        
        connectionUser.delete(data.user._id.toString(), socket.id);
        console.log("hhh",connectionUser);
        
        return "done";
    })
}