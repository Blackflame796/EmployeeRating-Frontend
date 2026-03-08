/**
 * Интерфейс, описывающий структуру данных сотрудника
 */
export interface Employee {
    id?: number; // Идентификатор
    first_name: string; // Имя
    second_name?: string; // Отчество
    surname: string; // Фамилия
    department_id?: number; // ID отдела
    revenue: number; // Выручка
    quality: number; // Качество работы
    discipline: number; // Дисциплина
    experience_years: number; // Стаж (лет)
    projects_completed: number; // Завершено проектов
    client_satisfaction: number; // Удовлетворенность клиентов
    teamwork_score: number; // Оценка командной работы
    salary: number;
    rating?: number; // Рассчитанный рейтинг
}