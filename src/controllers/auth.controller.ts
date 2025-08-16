import {Request,Response} from "express";
import { prisma } from "../prisma";
import {hash,compare} from "../utils/password"
import {newJti,signJwt} from "../utils/jwt"
import {env} from "../env"
import {redis} from "../redis"
import { error } from "console";

const cookieOpts={
    httpOnly:true
}
 export async function register(req:Request,res:Response) {
    const {email,password}= req.body;
    console.log(req.body)
    const exists = await prisma.user.findUnique({where:{email}});
    if(exists) {return res.status(409).json({error:"email_taken"});}
    const user= await prisma.user.create({data:{email,password:await hash(password)}});
    res.status(201).json({id:user.id,email:user.email})

 }

  export async function login(req:Request,res:Response) {
    const {email,password}= req.body;
    const user=await prisma.user.findUnique({where:{email}})
    if(!user||!(await compare(password,user.password))){
        return res.status(401).json({error:"Invalid Credentials"})
    }
    const jti=newJti()
    await prisma.user.update({where :{id:user.id},data:{activeJti:jti}})
    await redis.set(`user:${user.id}:jti`,jti)
    const token=signJwt(user.id,jti)
    res.cookie(env.COOKIE_NAME,token,cookieOpts)
    res.json({ok:true})
}

  export async function logout(req:Request,res:Response){
    const userId = (req as any).userId as string;
    await redis.del(`user:${userId}:jti`)
    await prisma.user.update({where:{id:userId},data:{activeJti:null}});
    res.clearCookie(env.COOKIE_NAME,{path:"/"})
    res.json({ok:true})
  }

    export async function me(req:Request,res:Response){
            const user=await prisma.user.findUnique({
                where:{id:(req as any).userId},
                select :{id:true,email:true,createdAt:true}
});
    res.json({user})

    }