import Player from "../models/player.js";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "../friendFunctions/authFriends.js";


export const authenticateUser=async(req,res,next)=>{
    try{
 // console.log(jwtSecret);
    console.log("auth middle ware m aa gya1");
    const auth = req.headers.authorization || "";
    const fromHeader = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    const fromCookie = req.cookies?.access_token || req.cookies?.token || req.cookies?.jwt;


    const token = fromHeader || fromCookie;
    // console.log(token);
    
    if (!token) return res.status(401).json({ message: "Authorization token missing. Please Login." });
const player = await getUserFromToken(token);//may throw

req.user = {
      userId: player._id,
      full_name: player.playerName,
    };
    next();
    
    }catch(err){
         return res.status(401).json({ message: err.message });
    }
}