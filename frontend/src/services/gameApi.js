import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// GET 25 numbers
export const makeBox = async () => {
  // console.log("maked call");
  
 const res = await API.post("/box/makeBox"); 
//  console.log("api ka response:",res);
// console.log(res.data);

//  console.log(res.data.startingNumbers);
 
  return res.data.startingNumbers;
};

// LOCK BOX
export const lockBox = async (roomId, grid) => {
  console.log("making call");
  
  const res = await API.post("/box/lockBox", {
    roomId,
    grid
  });

  return res.data;
};