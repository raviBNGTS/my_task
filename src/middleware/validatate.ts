import {z} from "zod";
import {Request,Response,NextFunction} from "express"

export const validate=
(schema :z.ZodObject<any>)=>
(req:Request,_res:Response,next:NextFunction)=>{
    const result = schema.safeParse({body:req.body,query:req.query,params:req.params});
    if(!result.success){
        return next({status:400,message:result.error.flatten()});
        next()
    }
};