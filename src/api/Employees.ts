
import type { Employee } from "../interfaces/Employee";
import type { EmployeeResponseType, EmployeesResponseType } from "../types/Responses";
import api from "./api"

export async function CreateEmployee(employee: Employee) {
    try {
        await api.post("/employees/create", employee).catch((e) => {
            throw new Error(e.message)
        })
    }
    catch (e) {
        // console.error(e.message)
        throw e;
    }
}

export async function GetEmployee(id: number): Promise<EmployeeResponseType> {
    try {
        const response = await api.get(`/employees/get/${id}`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    }
    catch(e)
    {
        throw e;
        // console.error(e.message)
    }
}

export async function GetEmployees(): Promise<EmployeesResponseType> {
    try {
        const response = await api.get(`/employees/all`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    }
    catch(e)
    {
        throw e;
    }
}

export async function DeleteEmployee(id: number): Promise<EmployeeResponseType> {
    try {
        const response = await api.delete(`/employees/delete/${id}`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    }
    catch(e)
    {
        throw e;
        // console.error(e.message)
    }
}