import type { Employee } from "../interfaces/Employee";

export type StandardResponseType = {
    data: {
        message?: string;
        detail?: {
            error_code?: string;
            message?: string;
        }
    };
    status: number;
};


export type StandardErrorResponseType = {
    data: {
        detail: {
            error_code: string;
            message: string;
        }
    };
    status: number;
}

export type EmployeeResponseType = {
    data: Employee
    status: number;
};

export type EmployeesResponseType = {
    data: Employee[]
    status: number;
};