/**
 * Страница создания нового профиля сотрудника
 * Содержит форму ввода всех рабочих и персональных показателей
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmployeesCreatePage.module.css";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { CreateEmployee } from "../../../api/Employees";
import { GetDepartments } from "../../../api/Department";
import type { Employee } from "../../../interfaces/Employee";
import type { Department } from "../../../interfaces/Department";
import Preloader from "../../../components/Preloader/Preloader";

const EmployeesCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    first_name: "",
    second_name: "",
    surname: "",
    department_id: undefined,
    revenue: "",
    quality: "",
    discipline: "",
    experience_years: "",
    projects_completed: "",
    client_satisfaction: "",
    teamwork_score: "",
  } as any);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await GetDepartments();
        setDepartments(response.data);
        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            department_id: response.data[0].id,
          }));
        }
      } catch (err) {
        console.error("Ошибка при загрузке отделов:", err);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    // Обработка специализированного поля department_id для сохранения числового типа данных
    if (name === "department_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: !isNaN(parseFloat(value)) ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        revenue: parseFloat(formData.revenue as any) || 0,
        quality: parseInt(formData.quality as any) || 0,
        discipline: parseInt(formData.discipline as any) || 0,
        experience_years: parseFloat(formData.experience_years as any) || 0,
        projects_completed: parseInt(formData.projects_completed as any) || 0,
        client_satisfaction:
          parseFloat(formData.client_satisfaction as any) || 4.0,
        teamwork_score: parseFloat(formData.teamwork_score as any) || 4.0,
      };

      await CreateEmployee(dataToSubmit);
      navigate("/employees");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании сотрудника",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Container}>
      <h1 className={styles.Title}>Создание нового сотрудника</h1>

      <form onSubmit={handleSubmit} className={styles.Form}>
        {error && <div className={styles.Error}>{error}</div>}

        <Input
          id="first_name"
          name="first_name"
          type="text"
          label="Имя"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Введите имя"
          required
        />

        <Input
          id="surname"
          name="surname"
          type="text"
          label="Фамилия"
          value={formData.surname}
          onChange={handleChange}
          placeholder="Введите фамилию"
          required
        />

        <Input
          id="second_name"
          name="second_name"
          type="text"
          label="Отчество"
          value={formData.second_name || ""}
          onChange={handleChange}
          placeholder="Введите отчество"
        />

        <Input
          id="revenue"
          name="revenue"
          type="number"
          label="Выручка (рубли)"
          value={formData.revenue}
          onChange={handleChange}
          placeholder="0.00"
          required
          min="0"
          step="0.01"
        />

        <div className={styles.FormRow}>
          <Input
            id="quality"
            name="quality"
            type="number"
            label="Кол-во выполненных задач"
            value={formData.quality}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
          />

          <Input
            id="discipline"
            name="discipline"
            type="number"
            label="Кол-во опозданий"
            value={formData.discipline}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
          />
        </div>

        <Select
          id="department_id"
          name="department_id"
          value={formData.department_id || ""}
          onChange={handleChange}
          label="Отдел"
          placeholder="Выберите отдел"
          options={departments.map((dept) => ({
            value: dept.id || 0,
            label: dept.name,
          }))}
        />
        <div className={styles.FormRow4}>
          <Input
            id="experience_years"
            name="experience_years"
            type="number"
            label="Опыт (годы)"
            value={formData.experience_years}
            onChange={handleChange}
            placeholder="0.0"
            required
            min="0"
            step="0.5"
          />

          <Input
            id="projects_completed"
            name="projects_completed"
            type="number"
            label="Завершённые проекты"
            value={formData.projects_completed}
            onChange={handleChange}
            placeholder="0"
            required
            min="0"
          />

          <Input
            id="client_satisfaction"
            name="client_satisfaction"
            type="number"
            label="Удовлетворённость клиентов (1-5)"
            value={formData.client_satisfaction}
            onChange={handleChange}
            placeholder="4.0"
            required
            min="1"
            max="5"
            step="0.1"
          />

          <Input
            id="teamwork_score"
            name="teamwork_score"
            type="number"
            label="Оценка командной работы (1-5)"
            value={formData.teamwork_score}
            onChange={handleChange}
            placeholder="4.0"
            required
            min="1"
            max="5"
            step="0.1"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={styles.SubmitButton}
          text={loading ? "Создание..." : "Создать"}
        />
      </form>

      {loading && <Preloader fullScreen text="Создание сотрудника..." />}
    </div>
  );
};

export default EmployeesCreatePage;
