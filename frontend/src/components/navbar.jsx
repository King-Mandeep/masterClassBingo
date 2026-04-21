import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { LogoutBtn } from "./LogoutBtn";
import { useState } from "react";

export const Navbar=()=>{
    const navigate=useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    return(
<>

<div className={styles.navbar}>
  <a href="#" className={styles.logo}><span className={styles[`logo-dot`]}></span>MasterClass Bingo</a>

  <ul className={`${styles["nav-links"]} ${menuOpen ? styles.active : ""}`}>
    <li><a onClick={()=>{navigate("/");
      setMenuOpen(false);
    }} className={styles.active}>Playground</a></li>
     {
        localStorage.getItem("userId")?(
<LogoutBtn/>
        ):
        (
<li><a onClick={()=>{navigate("/login");
  setMenuOpen(false);
}}>Login</a></li>
        )
    }
     {!localStorage.getItem("userId")&&(
<li><a onClick={()=>{navigate("/signup");
  setMenuOpen(false);
}}>Signup</a></li>
    )}
    
  </ul>

  <div className={styles[`nav-right`]}>
    <button id={styles[`theme-toggle`]}>🌙</button>
    {/* <button className={styles[`cta-nav`]}>Get Started</button> */}
    <button className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
    onClick={() => setMenuOpen(prev => !prev)}
>
      <span></span><span></span><span></span>
    </button>
  </div>
</div>

</>
    );
}