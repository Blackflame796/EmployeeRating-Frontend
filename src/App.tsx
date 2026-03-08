/**
 * Основной компонент приложения
 * Определяет глобальную разметку и конфигурацию маршрутизации (Routing)
 */
import "./App.css";
import Header from "./components/Header/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/page";
import Departments from "./pages/departments/page";
import CreateDepartmentPage from "./pages/departments/create/page";
import EditDepartmentPage from "./pages/departments/edit/page";
import Employees from "./pages/employees/page";
import EditEmployeePage from "./pages/employees/edit/page";
import EmployeesCreatePage from "./pages/employees/create/page";
import DepartmentViewPage from "./pages/departments/view/page";
import EmployeeViewPage from "./pages/employees/view/page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/create" element={<CreateDepartmentPage />} />
        <Route path="/departments/edit/:id" element={<EditDepartmentPage />} />
        <Route path="/departments/:id" element={<DepartmentViewPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<EmployeesCreatePage />} />
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="/employees/:id" element={<EmployeeViewPage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  );
}

export default App;
