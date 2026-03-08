/**
 * Компонент боковой навигации (сайдбара)
 * Используется преимущественно на мобильных устройствах
 */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, Menu, Home, Users, Building2 } from "lucide-react";
import styles from "./Sidebar.module.css";
import Button from "../Button/Button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        className={styles.MenuButton}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        Icon={Menu}
      />

      {/* Основная панель сайдбара */}
      <div className={`${styles.Sidebar} ${isOpen ? styles.Open : ""}`}>
        {/* Заголовок с логотипом и кнопкой закрытия */}
        <div className={styles.Header}>
          <div className={styles.LogoContainer}>
            <img src="/Logo/Logo.webp" alt="Logo" className={styles.Logo} />
            <div className={styles.Title}>EmployeeRating</div>
          </div>
          <button
            className={styles.CloseButton}
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Список навигационных ссылок */}
        <nav className={styles.Nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.NavLink} ${isActive ? styles.Active : ""}`
            }
            onClick={closeSidebar}
          >
            <Home size={20} />
            Главная
          </NavLink>
          <NavLink
            to="/departments"
            className={({ isActive }) =>
              `${styles.NavLink} ${isActive ? styles.Active : ""}`
            }
            onClick={closeSidebar}
          >
            <Building2 size={20} />
            Отделы
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `${styles.NavLink} ${isActive ? styles.Active : ""}`
            }
            onClick={closeSidebar}
          >
            <Users size={20} />
            Сотрудники
          </NavLink>
        </nav>
      </div>

      {/* Затемнение фона при открытом сайдбаре */}
      {isOpen && <div className={styles.Overlay} onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
