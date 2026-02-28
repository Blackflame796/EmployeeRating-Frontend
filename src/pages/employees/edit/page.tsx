import { useEffect, useState } from "react";
import type { EmployeeResponseType } from "../../../types/Responses";
import { GetEmployee } from "../../../api/Employees";
import { useParams } from "react-router-dom";
import type { Employee } from "../../../interfaces/Employee";

const EditEmployeePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const fetchEmployee = async () => {
    try {
      const response: EmployeeResponseType = await GetEmployee(Number(id));
      setEmployee(response.data);
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    fetchEmployee();
  }, []);
  return (
    <div>
      <div>
        <h1>{employee?.first_name}</h1>
        <h1>{employee?.second_name}</h1>
        <h1>{employee?.surname}</h1>
      </div>
    </div>
  );
};

export default EditEmployeePage;
