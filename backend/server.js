import 'dotenv/config';
import express from "express";
import { initSockets } from "./sockets/socketSetup.js";
import cors from "cors";
import http from "http";

import boxRoutes from "./routes/boxRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';

const app=express();
await connectDB();

const server= http.createServer(app);
app.use(cookieParser());
// IMPORTANT: enable json parsing
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
//initialize sockets
initSockets(server);

//make io availabe in controllers via req.io
// app.use((req, _res, next) => { req.io = io; next();});

//routes
app.use("/box",boxRoutes);
app.use("/auth",authRoutes);
app.use("/room",roomRoutes);



const PORT = process.env.PORT||3000;
server.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`);
});


app.get("/",(req,res)=>{
    res.send('hehehe');
})