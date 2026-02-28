import "./App.css";
import Header from "./components/Header/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/page";
import Departments from "./pages/departments/page";
import Employees from "./pages/employees/page";
import EditEmployeePage from "./pages/employees/edit/page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  );
}

export default App;
