/**
 * Типы данных для стандартизации ответов от API
 */
import type { Department } from "../interfaces/Department";
import type { Employee } from "../interfaces/Employee";

// Базовый тип успешного ответа
export type StandardResponseType = {
  data: {
    message?: string;
    detail?: {
      error_code?: string;
      message?: string;
    };
  };
  status: number;
};

// Тип ответа при возникновении ошибки
export type StandardErrorResponseType = {
  data: {
    detail: {
      error_code: string;
      message: string;
    };
  };
  status: number;
};

// Ответ с данными об одном сотруднике
export type EmployeeResponseType = {
  data: Employee;
  status: number;
};

// Ответ со списком сотрудников
export type EmployeesResponseType = {
  data: Employee[];
  status: number;
};

// Ответ со списком сотрудников для рейтинга
export type EmployeesRatingResponseType = {
  data: { employees: Employee[] };
  status: number;
};

// Ответ с данными об одном отделе
export type DepartmentResponseType = {
  data: Department;
  status: number;
};

// Ответ со списком всех отделов
export type DepartmentsResponseType = {
  data: Department[];
  status: number;
};
