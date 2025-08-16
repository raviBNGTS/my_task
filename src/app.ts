import express from "express"
// import { Request,response } from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import cors from "cors"
import authRouter from "./routes/auth.router"
import postRouter from "./routes/post.router"
import {env} from "./env"
import {errorHandlers} from "./middleware/error"

export function createApp(){
    const app = express();
    app.use(helmet());
    // app.use(cors(origin:env.APP_ORIGIN,credentials:true))
    app.use("/api/auth",authRouter)
    app.use("/api/posts",postRouter)
    app.use(express.json());
    app.use(cookieParser())
    // app.get("/api/heath",(req,res)=>{
    //     res.json({status:"ok"})
    // });
    app.use(errorHandlers)
    return app
}