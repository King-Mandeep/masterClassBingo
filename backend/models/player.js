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
    tokens:{
        type:BigInt,default:100
    },
     gamesAnalytics:{
        
            totalGames: {
    type: Number,
    default: 0,
  },

  wins: {
    type: Number,
    default: 0,
  },

  losses: {
    type: Number,
    default: 0,
  },
        
    },
},
{timestamps:true});

export default mongoose.model("Player",playerSchema);