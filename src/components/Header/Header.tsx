/**
 * Основной компонент шапки приложения
 * Содержит сайдбар, логотип и навигационную панель
 */
import NavBar from "../NavBar/NavBar";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Header.module.css";
import logo from "/Logo/Logo.webp";

function Header() {
  return (
    <header className={styles.Header}>
      <Sidebar />
      <a href="/"><img width={48} height={48} src={logo}/></a>
      <NavBar />
    </header>
  );
}

export default Header;
