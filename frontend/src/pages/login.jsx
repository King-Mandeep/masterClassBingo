import { useState } from "react";
// import { setLocalStorageSocialData } from "../data/getSetLocalStorage";
import styles from "./login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "../components/loadingComponent";
import { Navbar } from "../components/navbar";
// import {BASE_URL} from "../api";
export const Login=()=>{

     const [formData, setFormData] = useState({
        contactNumber: "",
        password: "",
      });
      const [message, setMessage] = useState("");
      const [messageType, setMessageType] = useState(""); // "success" | "error"
      const [loading,setLoading]=useState(false);

    
       const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // const API=`http://localhost:3000/auth/login`;
    const BASE_URL= import.meta.env.VITE_API_URL;;
     const API=`${BASE_URL}/auth/login`;
    setMessage('');

    try{
            const res=await axios.post(API,formData,{withCredentials: true});
               setLoading(false);
            //save the token to local storage
            // setLocalStorageSocialData({token:res.data.jwt.token,userId:res.data.player._id});
            localStorage.setItem("userId", res.data.player._id);
            console.log("MY ID:", localStorage.getItem("userId"));
            setMessage(`login successful! ${res.data.message}`);
            setMessageType("success");
            // console.log(res);
            setFormData({
    contactNumber: "",
    password: ""
  });

   // Redirect after login (e.g., to homepage)
      setTimeout(() => {
        navigate("/");
      }, 2000);
    
//   console.log(res);
    }
    catch(err){
         setLoading(false);
   if (err.response && err.response.data) {
      setMessage(err.response.data.message || err.response.data.error);
    }
    else {
      setMessage('Something went wrong');
    }
     setMessageType("error");
    }

  };

    return(
      <>
      {loading&&( <LoadingComponent></LoadingComponent> )}
      <Navbar/>
      {!loading&&( <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login to your Account</h2>

          <input
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          type="text"
          placeholder="enter your Contact Number"
          required
        />

        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="text"
          placeholder="What's your password?"
          required
        />

          <button type="submit" className={styles.loginButton}>
          Login
        </button>
         <p>Don't have an account!</p>

    <button className={styles.signUpButton} onClick={()=>navigate("/signup")}>SIGN UP</button>

        {message && (
  <p
    className={`${styles.message} ${
      messageType === "success" ? styles.messageSuccess : styles.messageError
    }`}
  >
    {message}
  </p>
)}
      {messageType === "success" && (
  <p className={`${styles.message} ${styles.messageSuccess}`}>
    Please wait redirecting
  </p>
)}
<p className={styles.agreementText}>
      By clicking Log in or Sign up, you agree to the{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        href=""
      >
       MasterClassBingo Terms of Service
      </a>{' '}
      and{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        href=""
      >
        Privacy Notice
      </a>.
    </p>
    </form>
    
   
        </div>)}
</>
    );
}