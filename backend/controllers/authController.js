import Player from "../models/player.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.jwtSecret||"bingo";



export const signup = async(req,res)=>{
    try{
const take = req.body;
const {playerName,contactNumber,password}=take;
if(!playerName||!contactNumber||!password){
    return res.status(400).json({message:
        "All fields are required"
    });
}
const existingPlayer = await Player.findOne({contactNumber});
if(existingPlayer){
    return res.status(400).json({message:"Contact Number already regestered. Login or try with another number."});
}

const hasdedPassword = await argon2.hash(password);
const newPlayer = new Player({
    playerName,
    contactNumber,
    password:hasdedPassword,
});

await newPlayer.save();
res.status(201).json({message: "Player registered successfully!",playerId:newPlayer._id});

    }catch(error){
res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const login = async (req,res)=>{
    try{
const {contactNumber,password}=req.body;
// console.log(contactNumber,password);

if(!contactNumber||!password){
    return res.status(400).json({message:"Provide both"});
}

const player = await Player.findOne({
    contactNumber
}).select("+password");
if(!player){
    return res.status(404).json({message:"Player not found."});
}

const isMatch = await argon2.verify(player.password, password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    //jwt payload
    const payload={
       id: String(player._id), 
       name: player.playerName,
    }

     const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "7d",
    });

    res.cookie("access_token", token, {
  httpOnly: true,
  secure: true,            // REQUIRED on HTTPS (Render/Vercel)
  sameSite: "none",        // REQUIRED for cross-site cookies
  maxAge: 48 * 60 * 60 * 1000,
});
//  res.cookie("access_token", token, {
//   httpOnly: true,
//   secure: false,           
//   sameSite: "lax",        // REQUIRED for cross-site cookies
//   maxAge: 24 * 60 * 60 * 1000,
// });


 res.json({
      message: "Login successful",
      player: {
        name: player.playerName,
        _id:player._id,
      },
      jwt :{
        token : token
      }
    });


    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}