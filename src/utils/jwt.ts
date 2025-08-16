import jwt from "jsonwebtoken"
import crypto from "crypto"
import{env} from "../env"
export function newJti(){
    return crypto.randomBytes(16).toString("hex");
}

export function signJwt(sub:string,jti:string){
    return jwt.sign({sub,jti},env.JWT_SECRET,{expireIn:"7d"})
}
export type JwtPayload ={sub:string;jti:string}