import { createBrowserRouter, RouterProvider }from "react-router-dom";

// import { Landing } from "./pages/landing";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import { Landing } from "./pages/newLanding";





const router = createBrowserRouter([
  {path:"/",element:<Landing/>},
  {path:"/signup",element:<Signup/>},
  {path:"/login",element:<Login/>}
]);

const App =()=>{
  return(
    <>
     <RouterProvider router={router} />
    </>
  )
}
export default App;