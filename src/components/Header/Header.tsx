import NavBar from "../NavBar/NavBar";
import styles from "./Header.module.css";
import logo from "/Logo/Logo.webp";

function Header() {
  return (
    <header className={styles.Header}>
      <a href="/"><img width={48} height={48} src={logo}/></a>
      <NavBar />
    </header>
  );
}

export default Header;
