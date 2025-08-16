import http from "http";
import {createApp} from "./app";
import {createIo} from "./socket"
import {env} from "./env"
import { attachIo } from "./controllers/post.controller";

const app = createApp();
const server = http.createServer(app)
const io = createIo(server)
attachIo(io)

server.listen(env.PORT,()=>{
    console.log(`sever run on port ${env.PORT}`)
})