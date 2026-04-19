import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    playerName:{
        type:String,
    },
    contactNumber:{
        type:String, unique:true,
    },
    password:{
        type:String,required:true,select:false
    },
},
{timestamps:true});

export default mongoose.model("Player",playerSchema);