/**
 * Страница детального просмотра сотрудника
 * Отображает персональную информацию, показатели эффективности и рассчитанный рейтинг
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EmployeeViewPage.module.css";
import { GetEmployee } from "../../../api/Employees";
import { GetDepartments } from "../../../api/Department";
import type { Employee } from "../../../interfaces/Employee";
import type { Department } from "../../../interfaces/Department";
import Preloader from "../../../components/Preloader/Preloader";
import { ArrowBigLeft, Pencil } from "lucide-react";
import Button from "../../../components/Button/Button";

const EmployeeViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [empRes, deptRes] = await Promise.all([
          GetEmployee(Number(id)),
          GetDepartments(),
        ]);

        const empData = empRes.data;
        setEmployee(empData);

        if (empData.department_id) {
          const dept = deptRes.data.find((d) => d.id === empData.department_id);
          setDepartment(dept || null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ошибка загрузки данных сотрудника"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.Container}>
        <div className={styles.LoadingContainer}>
          <Preloader text="Загрузка данных сотрудника..." />
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className={styles.Container}>
        <div className={styles.Error}>{error || "Сотрудник не найден"}</div>
        <Button type="button" onClick={() => navigate(-1)} className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.HeaderLeft}>
          <Button type="button" onClick={() => navigate(-1)} className={styles.ReturnButton}>
            <ArrowBigLeft size={28} />
          </Button>
          <h1 className={styles.Title}>
            {employee.surname} {employee.first_name} {employee.second_name}
          </h1>
        </div>
        <div className={styles.HeaderActions}>
          <Button 
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
            type="button"
            Icon={Pencil}
            classNameIcon={styles.EditButton}
          />
        </div>
      </div>

      <div className={styles.Content}>

        <div className={styles.Card}>
          <h2 className={styles.CardTitle}>Основная информация</h2>
          <div className={styles.InfoGrid}>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>ID Сотрудника</span>
              <span className={styles.InfoValue}>{employee.id}</span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Отдел</span>
              <span className={styles.InfoValue}>
                {department ? department.name : "Не назначен"}
              </span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Опыт работы</span>
              <span className={styles.InfoValue}>
                {employee.experience_years} {employee.experience_years === 1 ? 'год' : employee.experience_years >= 2 && employee.experience_years <= 4 ? 'года' : 'лет'}
              </span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Завершённые проекты</span>
              <span className={styles.InfoValue}>{employee.projects_completed}</span>
            </div>
          </div>
        </div>

        <div className={styles.Card}>
          <h2 className={styles.CardTitle}>Показатели эффективности</h2>
          <div className={styles.InfoGrid}>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Выручка</span>
              <span className={styles.InfoValue} style={{ color: '#4ade80' }}>
                {employee.revenue.toLocaleString()} ₽
              </span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Среднее время опоздания</span>
              <span className={styles.InfoValue} style={{ color: employee.quality > 15 ? '#f87171' : '#fff' }}>
                {employee.quality} мин
              </span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Уровень качества работы</span>
              <span className={styles.InfoValue} style={{ color: employee.discipline < 70 ? '#f87171' : '#4ade80' }}>
                {employee.discipline}%
              </span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Удовлетворенность клиентов</span>
              <span className={styles.InfoValue}>{employee.client_satisfaction?.toFixed(1) || '0.0'} / 5.0</span>
            </div>
            <div className={styles.InfoItem}>
              <span className={styles.InfoLabel}>Командная работа</span>
              <span className={styles.InfoValue}>{employee.teamwork_score?.toFixed(1) || '0.0'} / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewPage;
