import {Request,Response,NextFunction} from "express"
import jwt from"jsonwebtoken"
import {env} from "../env"
import {redis} from "../redis"
import type { JwtPayload } from "../utils/jwt"

export function requireAuth(req:Request,res:Response,next:NextFunction){
    try{
        const token = req.cookie[env.COOKIE_NAME||req.headers.authorozation.split(" ")[1]]
        if(!token){
            return res.status(401).json({error:"unauhtorized"})
        }
        const {sub,jti}= jwt.verify(token,env.JWT_SECRET) as JwtPayload
        redis.get(`user:${sub}:jti`).then(current=>{
            if(current !==jti){
                return res.status(401).json({error:"session_revoked"})
            }
            (req as any).userId= sub;
            (req as any).jti=jti;
            next()
        })
    }
    catch{
        return res.status(401).json({error:"unauthorized"})
    }
}