import {Server} from "socket.io"
import type {Server as HttpSever} from "http"
import {env} from "./env"
import jwt from "jsonwebtoken"
import {redis} from "./redis" 
import type { JwtPayload } from "./utils/jwt"


export function createIo(server:HttpSever){
    const io = new Server(server,{
        // cors:{origin:env.APP_ORIGIN,credentials:true}
    })
    io.use(async(socket,next)=>{
        try{
            const cookie = socket.request.headers.cookie??"";
            const cookieToken= cookie.split(";").map(s=>s.trim()).find(c=>c.startsWith(`${env.COOKIE_NAME}=`))?.split("=")[1]
            const token = socket.handshake.auth?.token || cookieToken;
            if(!token){
                return next(new Error("unauthorized"))
            }
            const {sub,jti}= jwt.verify(token,env.JWT_SECRET) as JwtPayload;
            const current = await redis.get(`user:${sub}:jti`);
            if(current !==jti){
                return next(new Error("session_revoked"))
            }
            socket.data.userId=sub;
            socket.join("posts")
            socket.join(`user:${sub}`)
            next();
        }
        catch{next(new Error("unauthorized"))}
    });
    io.on("connection",socket =>{
        socket.on("ping",cb=>cb?.("pong"))
    });
    return io;
}