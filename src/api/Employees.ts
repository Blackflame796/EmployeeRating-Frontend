import type { Employee } from "../interfaces/Employee";
import type {
  EmployeeResponseType,
  EmployeesRatingResponseType,
  EmployeesResponseType,
} from "../types/Responses";
import api from "./api";

/**
 * Создание нового сотрудника
 * @param employee Данные сотрудника для создания
 */
export async function CreateEmployee(employee: Employee) {
  try {
    await api.post("/employees/create", employee).catch((e) => {
      throw new Error(e.message);
    });
  } catch (e) {
    throw e;
  }
}

/**
 * Получение данных конкретного сотрудника по ID
 * @param id Идентификатор сотрудника
 */
export async function GetEmployee(id: number): Promise<EmployeeResponseType> {
  try {
    const response = await api.get(`/employees/get/${id}`).catch((e) => {
      throw new Error(e.message);
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/**
 * Получение списка всех сотрудников
 */
export async function GetEmployees(): Promise<EmployeesResponseType> {
  try {
    const response = await api.get(`/employees/all`).catch((e) => {
      throw new Error(e.message);
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/**
 * Обновление данных сотрудника
 * @param id Идентификатор сотрудника
 * @param employee Новые данные сотрудника
 */
export async function UpdateEmployee(id: number, employee: Employee) {
  try {
    await api.put(`/employees/update/${id}`, employee).catch((e) => {
      throw new Error(e.message);
    });
  } catch (e) {
    throw e;
  }
}

/**
 * Удаление сотрудника
 * @param id Идентификатор сотрудника
 */
export async function DeleteEmployee(
  id: number,
): Promise<EmployeeResponseType> {
  try {
    const response = await api.delete(`/employees/delete/${id}`).catch((e) => {
      throw new Error(e.message);
    });
    return response;
  } catch (e) {
    throw e;
  }
}

/**
 * Получение рейтинга сотрудников с возможностью сортировки и ограничения количества
 * @param sort_by Поле для сортировки
 * @param order Порядок сортировки (asc/desc)
 * @param limit Максимальное количество записей
 */
export async function GetEmployeeRating(
  sort_by?: string,
  order?: "asc" | "desc",
  limit?: number,
): Promise<EmployeesRatingResponseType> {
  try {
    if (sort_by && order && limit) {
      const response = await api
        .get(
          `/employees/rating?sort_by=${sort_by}&order=${order}&limit=${limit}`,
        )
        .catch((e) => {
          throw new Error(e.message);
        });
      return response;
    } else if (sort_by && order) {
      const response = await api
        .get(`/employees/rating?sort_by=${sort_by}&order=${order}`)
        .catch((e) => {
          throw new Error(e.message);
        });
      return response;
    } else {
      const response = await api.get(`/employees/rating`).catch((e) => {
        throw new Error(e.message);
      });
      return response;
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Получение рейтинга сотрудников конкретного отдела
 * @param department_id Идентификатор отдела
 * @param sort_by Поле для сортировки
 * @param order Порядок сортировки
 * @param limit Лимит записей
 */
export async function GetEmployeeRatingByDepartment(
  department_id: number,
  sort_by?: string,
  order?: "asc" | "desc",
  limit?: number,
): Promise<EmployeesRatingResponseType> {
  try {
    if (sort_by && order && limit) {
      const response = await api
        .get(
          `/departments/get/${department_id}/rating?sort_by=${sort_by}&order=${order}&limit=${limit}`,
        )
        .catch((e) => {
          throw new Error(e.message);
        });
      return response;
    } else if (sort_by && order) {
      const response = await api
        .get(`/departments/get/${department_id}/rating?sort_by=${sort_by}&order=${order}`)
        .catch((e) => {
          throw new Error(e.message);
        });
      return response;
    } else {
      const response = await api.get(`/departments/get/${department_id}/rating`).catch((e) => {
        throw new Error(e.message);
      });
      return response;
    }
  } catch (e) {
    throw e;
  }
}