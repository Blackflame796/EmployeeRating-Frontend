import type { Department } from "../interfaces/Department";
import type { DepartmentResponseType, DepartmentsResponseType, EmployeesRatingResponseType } from "../types/Responses";
import api from "./api";

/**
 * Получение списка всех отделов
 */
export async function GetDepartments(): Promise<DepartmentsResponseType> {
    try {
        const response = await api.get(`/departments/all`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    }
    catch(e) {
        throw e;
    }
}

/**
 * Получение данных конкретного отдела по ID
 * @param id Идентификатор отдела
 */
export async function GetDepartment(id: number): Promise<DepartmentResponseType> {
    try {
        const response = await api.get(`/departments/get/${id}`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    }
    catch(e) {
        throw e;
    }
}

/**
 * Создание нового отдела
 * @param department Данные отдела
 */
export async function CreateDepartment(department: Department) {
    try {
        await api.post(`/departments/create`, department).catch((e) => {
            throw new Error(e.message);
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Обновление данных существующего отдела
 * @param id Идентификатор отдела
 * @param department Новые данные отдела
 */
export async function UpdateDepartment(id: number, department: Department) {
    try {
        await api.put(`/departments/update/${id}`, department).catch((e) => {
            throw new Error(e.message);
        });
    } catch (e) {
        throw e;
    }
}

/**
 * Удаление отдела по ID
 * @param id Идентификатор отдела
 */
export async function DeleteDepartment(id: number): Promise<DepartmentResponseType> {
    try {
        const response = await api.delete(`/departments/delete/${id}`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    } catch (e) {
        throw e;
    }
}

/**
 * Получение рейтинга сотрудников для определенного отдела
 * @param id Идентификатор отдела
 */
export async function GetEmployeeRatingByDepartment(id: number): Promise<EmployeesRatingResponseType> {
    try {
        const response = await api.get(`/departments/get/${id}/rating`).catch((e) => {
            throw new Error(e.message);
        });
        return response;
    } catch (e) {
        throw e;
    }
}