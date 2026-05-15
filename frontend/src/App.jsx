import { createBrowserRouter, RouterProvider }from "react-router-dom";

// import { Landing } from "./pages/landing";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import { Landing } from "./pages/newLanding";
import { Leaderboard } from "./pages/leaderBoard";
import { Profile } from "./pages/profile";




const router = createBrowserRouter([
  {path:"/",element:<Landing/>},
  {path:"/signup",element:<Signup/>},
  {path:"/login",element:<Login/>},
  {path:"/leaderboard",element:<Leaderboard/>},
  {path:"/profile",element:<Profile/>},
]);

const App =()=>{
  return(
    <>
     <RouterProvider router={router} />
    </>
  )
}
export default App;