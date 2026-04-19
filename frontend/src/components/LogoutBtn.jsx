import { useNavigate } from "react-router-dom";

export const LogoutBtn=()=>{
    const navigate=useNavigate();
const handleLogout=()=>{
    localStorage.removeItem("userId");
    navigate("/");
    window.location.href = "/";
}

    return(
      <button onClick={handleLogout}>
      Logout
    </button>
    );
}