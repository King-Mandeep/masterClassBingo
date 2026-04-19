import { useState } from "react";
import styles from "./signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "../components/loadingComponent";
import { Navbar } from "../components/navbar";
// import {BASE_URL} from "../api";
export const Signup = () => {
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
      const [disable,setDisable]=useState(false);
  const [formData, setFormData] = useState({
    playerName: "",
    password: "",
    contactNumber: "",
  });

  const [messageAndType, setMessageAndType] = useState({
    message:'',
    messageType:''
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDisable((prev)=>!prev);
   
    // https://gamesgrid.onrender.com
    const BASE_URL = "http://localhost:3000";
    // const API=`http://localhost:3000/auth/signup`;
    const API=`${BASE_URL}/auth/signup`;
    setMessageAndType({
    message:'',
    messageType:''
  });

    try{
            const res = await axios.post(API, formData, {
  withCredentials: true
});
            setMessageAndType({
              message: `signup successful! ${res.data.message}`,
              messageType:'success'
            });
             setLoading(false);
            
            setFormData({
   playerName: "",
    password: "",
    contactNumber: "",
  });
   // Redirect after signup
      setTimeout(() => {
        navigate("/login");
      }, 4000);
  // console.log(res);
    }
    catch(err){
         setLoading(false);
   if (err.response && err.response.data) {
      // setMessage(err.response.data.message || err.response.data.error);
      setMessageAndType(prev => ({
  ...prev,
  message: err.response.data.message || err.response.data.error
}));
    }
    else {
      // setMessage('Something went wrong');
         setLoading(false);
      setMessageAndType(prev => ({
  ...prev,
  message: "Something went wrong"
}));
    }
   setMessageAndType(prev => ({
  ...prev,
  messageType: "error"
}));
    }

  };
  return (<>
    {loading&&( <LoadingComponent/> )}
    <Navbar/>
    {!loading&&( <div className={styles.signupContainer}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <h2>Create Account</h2>

        <input
          name="playerName"
          value={formData.playerName}
          onChange={handleChange}
          type="text"
          placeholder="What's your name?"
          required
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Set up a password!"
          required
        />
        <input
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          type="text"
          placeholder="We want your Phone Number!"
        />

        <button disabled={disable} type="submit" className={styles.signupButton}>
          Join The Master Community
        </button>
        {messageAndType.message && (
         <p
           className={`${styles.message} ${
             messageAndType.messageType === "success" ? styles.messageSuccess : styles.messageError
           }`}
         >
           {messageAndType.messageType==="success"}
          Redirecting to login page
         </p>
       )}

         <div className={styles.successActions}> 
           <button
            type="button"
            className={styles.secondaryButton}
            onClick={() =>navigate('/')}
          >
            Go Back
          </button>
           <button
            type="button"
            className={styles.secondaryButton}
            onClick={()=>navigate('/login')} 
          >
            Already have an acccount! Login
          </button></div>
       
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
};
