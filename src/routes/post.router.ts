
import{Router} from "express";
import {z} from "zod"
import {validate} from "../middleware/validatate"
import {requireAuth} from "../middleware/auth"
import {listPosts,createPost,getPost,updatePost,deletePost} from "../controllers/post.controller"
import {cache} from "../middleware/cache"
const router = Router();

router.get("/",cache(30,()=>"posts:all"),listPosts)

router.post("/createPost",requireAuth,
    validate({body:z.object({title:z.string().min(1),body:z.string().min(1)})}as any)
    ,createPost)
router.get("/:id",cache(60,(req)=>`posts:${req.params.id}`),getPost)
router.put("/:id",requireAuth,validate({body:z.object({title:z.string().min(1),body:z.string().min(1)})}as any),updatePost)
router.delete("/:id",requireAuth,deletePost)

export default router;
