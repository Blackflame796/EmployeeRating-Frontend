import { NavLink } from "react-router-dom";
import Button from "../Button/Button";

const NavBar = () => {
    return (<>
    <NavLink to={"/"}>
        <Button type="button" text="Главная"/>
    </NavLink>
    <NavLink to={"/departments"}>
        <Button type="button" text="Отделы"/>
    </NavLink>
    <NavLink to={"/employees"}>
        <Button type="button" text="Сотрудники"/>
    </NavLink>
    </>)
}

export default NavBar;