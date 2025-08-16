import {Request,Response} from "express";
import { prisma } from "../prisma";
import {invalidate} from "../middleware/cache"
import type{Server}from "socket.io"
import { title } from "process";

let ioRef :Server | null =null;
export function attachIo(io:Server){ioRef=io}

export async function listPosts(req:Request,res:Response) {
    const posts = await prisma.post.findMany({
        orderBy:{createdAt:"desc"},
        select:{id:true,title:true,body:true,authorId:true,createdAt:true}
    });
    res.json(posts)
}

export async function createPost(req:Request,res:Response) {
    const authorId = (req as any ).userId as string
    const {title,body}= req.body;
    const post = await prisma.post.create({data:{title,body,authorId}})
    await invalidate(["posts.all"])
    ioRef?.to("posts").emit("posts:created",post)
    res.status(201).json(post)
}

export async function getPost(req:Request,res:Response) {
    const post = await prisma.post.findUnique({
        where:{id:req.params.id}
    });
    if(!post){
        return res.status(404).json({error:"not found"})
    }
    res.json(post)
}

export async function updatePost(req:Request,res:Response) {
    const post = await prisma.post.update({
        where:{id:req.params.id},
        data:{title:req.body.title,body:req.body.body}
    });
    await invalidate(["posts:all",`posts:${req.params.id}`])
    ioRef?.to("posts").emit("posts:updated",post)
    res.json(post)
}

export async function deletePost(req:Request,res:Response) {
    const post = await prisma.post.delete({
        where:{id:req.params.id}});
    await invalidate(["posts:all",`posts:${req.params.id}`])
    ioRef?.to("posts").emit("posts:delete",post)

    res.status(204).end()
}