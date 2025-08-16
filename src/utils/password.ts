import bcrypt from "bcrypt"
export const hash =(p:string)=>bcrypt.hash(p,12);
export const compare=(p:string,h:string)=>bcrypt.compare(p,h)