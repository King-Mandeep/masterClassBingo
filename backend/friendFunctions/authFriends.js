import jwt from "jsonwebtoken";
import Player from "../models/player.js"


const jwtSecret = process.env.JWT_SECRET||"bingo";

export async function getUserFromToken(token){
    // console.log(token,"in getUserFrom Token");
    
    if(!token) throw new Error("Authorization token missing.");
    let decoded;
    try{
        // console.log("yha tk shi h");
        // console.log(jwtSecrets);
        
        decoded= jwt.verify(token,jwtSecret);
    }catch(err){
        // console.log("decoding m galti h");
        console.log(err);
        
        
        throw new Error("Invalid or expired token, You have to Login.");
    }

const id = decoded.ID || decoded._id||decoded.id;
if (!id) throw new Error("Invalid token payload.");

const player = await Player.findById(id).select("_id playerName contactNumber");
if(!player) throw new Error("Player not found");

return player;
}