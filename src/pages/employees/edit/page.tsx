/**
 * Страница редактирования данных сотрудника
 * Позволяет изменять персональные данные и рабочие показатели
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EmployeesEditPage.module.css";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { GetEmployee, UpdateEmployee } from "../../../api/Employees";
import { GetDepartments } from "../../../api/Department";
import type { Employee } from "../../../interfaces/Employee";
import type { Department } from "../../../interfaces/Department";
import Preloader from "../../../components/Preloader/Preloader";
import { ArrowBigLeft } from "lucide-react";

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState<Employee>({
    id: undefined,
    first_name: "",
    second_name: "",
    surname: "",
    department_id: undefined,
    revenue: 0,
    quality: 0,
    discipline: 0,
    experience_years: 0,
    projects_completed: 0,
    client_satisfaction: 0,
    teamwork_score: 0,
    salary: 0,
  });

  // Комплексная загрузка начальных данных: профиль сотрудника и список доступных отделов
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const [employeeResponse, departmentsResponse] = await Promise.all([
          GetEmployee(Number(id)),
          GetDepartments(),
        ]);

        setDepartments(departmentsResponse.data);
        setFormData(employeeResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка при загрузке данных",
        );
        console.error("Ошибка при загрузке:", err);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        revenue: parseFloat(formData.revenue.toString()) || 0,
        quality: parseInt(formData.quality.toString()) || 0,
        discipline: parseInt(formData.discipline.toString()) || 0,
        experience_years: parseFloat(formData.experience_years.toString()) || 0,
        projects_completed:
          parseInt(formData.projects_completed.toString()) || 0,
        client_satisfaction:
          parseFloat(formData.client_satisfaction.toString()) || 4.0,
        teamwork_score: parseFloat(formData.teamwork_score.toString()) || 4.0,
      };

      await UpdateEmployee(Number(id), dataToSubmit);
      navigate(`/employees/${id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при обновлении сотрудника",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={styles.Container}>
        <div className={styles.LoadingContainer}>
          <Preloader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <Button type="button" onClick={() => navigate(-1)} className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Button>
        <h1 className={styles.Title}>Редактирование сотрудника</h1>
        <div style={{ width: 40 }}></div>
      </div>

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

        <Input
          id="salary"
          name="salary"
          type="number"
          label="Заработная плата (рубли)"
          value={formData.salary || 0}
          onChange={handleChange}
          placeholder="0"
          required
          min="0"
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

        <div className={styles.FormGroup}>
          <Select
            id="department_id"
            name="department_id"
            value={formData.department_id || ""}
            onChange={handleSelectChange}
            label="Отдел"
            placeholder="Выберите отдел"
            options={departments.map((dept) => ({
              value: dept.id || 0,
              label: dept.name,
            }))}
          />
        </div>

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
          text={loading ? "Сохранение..." : "Сохранить"}
        />
      </form>

      {loading && <Preloader fullScreen />}
    </div>
  );
};

export default EditEmployeePage;
