/**
 * Компонент навигационной панели
 * Отображает ссылки на основные разделы приложения с подсветкой активного состояния
 */
import { NavLink, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./NavBar.module.css";

const NavBar = () => {
    const location = useLocation();
    return (
        <div className={styles.NavBar}>
            <NavLink to={"/"}>
                <Button className={location.pathname === "/" ? styles.Active : ""} type="button" text="Главная"/>
            </NavLink>
            <NavLink to={"/departments"}>
                <Button className={location.pathname.startsWith("/departments") ? styles.Active : ""} type="button" text="Отделы"/>
            </NavLink>
            <NavLink to={"/employees"}>
                <Button className={location.pathname.startsWith("/employees") ? styles.Active : ""} type="button" text="Сотрудники"/>
            </NavLink>
        </div>
    )
}

export default NavBar;