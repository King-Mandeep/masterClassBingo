import {randomArray} from "../friendFunctions/randomArray.js";

// const startingNumbers=randomArray();
// console.log(startingNumbers);
export const makeStartingBox=(req,res)=>{
    try{
const startingNumbers=randomArray();
console.log(startingNumbers);
res.status(200).json({message:"Here are the starting numbers: ",startingNumbers:startingNumbers});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error",err: err.message})
    }
}