import {Request,Response,NextFunction} from "express"
import {redis} from "../redis"
export function cache(ttlSecond:number,keyBuilder:(req:Request)=>string){
    return async (req:Request,res:Response,next:NextFunction)=>{
        const key = keyBuilder(req)
        const cached = await redis.get(key)
        if(cached){
            return res.set("X-Cache","HIT").json(JSON.parse(cached))
        }
        const json = res.json.bind(res);
        res.json= (body:any)=>{
            redis.setex(key,ttlSecond,JSON.stringify(body)).catch(()=>{})
            res.set("X-Cache","MISS");
            return json(body)
        }
        next();
    }
}

export function invalidate(keys:string[]){
    return Promise.all(keys.map(k=>redis.del(k).catch(()=>{})))
}