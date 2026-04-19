import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { LogoutBtn } from "./LogoutBtn";

export const Navbar=()=>{
    const navigate=useNavigate();
    return(
<>

<div className={styles.navbar}>
  <a href="#" className={styles.logo}><span className={styles[`logo-dot`]}></span>MasterClass Bingo</a>

  <ul className={styles[`nav-links`]} className={styles[`nav-links`]}>
    <li><a onClick={()=>navigate("/")} className={styles.active}>Playground</a></li>
    {
        localStorage.getItem("userId")?(
<LogoutBtn/>
        ):
        (
<li><a onClick={()=>navigate("/login")}>Login</a></li>
        )
    }
    {!localStorage.getItem("userId")&&(
<li><a onClick={()=>navigate("/signup")}>Signup</a></li>
    )}
    
  </ul>

  <div className={styles[`nav-right`]}>
    <button id={styles[`theme-toggle`]}>🌙</button>
    {/* <button className={styles[`cta-nav`]}>Get Started</button> */}
    <button className={styles.hamburger} className={styles[`menu-toggle`]}>
      <span></span><span></span><span></span>
    </button>
  </div>
</div>

</>
    );
}