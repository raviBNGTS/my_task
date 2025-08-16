
import{Router} from "express";
import {z} from "zod"
import {validate} from "../middleware/validatate"
import {requireAuth} from "../middleware/auth"
import {register,login,logout,me} from "../controllers/auth.controller"

const router = Router();

// const credentials = z.object({
//     body:z.object({
//         email:z.string().email(),
//         password:z.string().min(8)
//     })})

router.post("/register",register)
router.post("/login",login)
router.post("/logout",requireAuth,logout)
router.get("/me",requireAuth,me)

export default router;
