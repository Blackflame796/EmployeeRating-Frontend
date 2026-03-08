/**
 * Страница детального просмотра отдела
 * Содержит визуализацию рейтинга сотрудников (ScatterChart) и подробный список
 */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GetDepartment, GetEmployeeRatingByDepartment } from "../../../api/Department";
import type { Department } from "../../../interfaces/Department";
import type { Employee } from "../../../interfaces/Employee";
import Preloader from "../../../components/Preloader/Preloader";
import Table from "../../../components/Table/Table";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import styles from "./DepartmentViewPage.module.css";
import { ArrowBigLeft } from "lucide-react";

interface EmployeeWithRating extends Employee {
  rating?: number;
}

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.Tooltip}>
        <p className={styles.TooltipName}>
          {data.surname} {data.first_name} {data.second_name}
        </p>
        <p className={styles.TooltipStat}>
          Кол-во задач: {data.quality}
        </p>
        <p className={styles.TooltipStat}>
          Рейтинг: {data.rating}
        </p>
      </div>
    );
  }
  return null;
};

const DepartmentViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<EmployeeWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных отдела и связанных с ним сотрудников при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [deptRes, empRes] = await Promise.all([
          GetDepartment(Number(id)),
          GetEmployeeRatingByDepartment(Number(id)),
        ]);
        
        setDepartment(deptRes.data);
        setEmployees(empRes.data.employees);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ошибка загрузки данных отдела"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Определение структуры колонок для детальной таблицы сотрудников
  const columns = [
    {
      key: "name",
      header: "Сотрудник",
      render: (emp: EmployeeWithRating) => (
        <div className={styles.EmployeeName}>
          <span className={styles.EmployeeNameMain}>
            {emp.surname} {emp.first_name}
          </span>
          {emp.second_name && (
            <span className={styles.EmployeeNameSub}>{emp.second_name}</span>
          )}
        </div>
      ),
    },
    {
      key: "quality",
      header: "Выполнено задач",
      render: (emp: EmployeeWithRating) => emp.quality,
    },
    {
      key: "revenue",
      header: "Выручка",
      render: (emp: EmployeeWithRating) => `${emp.revenue.toLocaleString()} ₽`,
    },
    {
      key: "rating",
      header: "Общий Рейтинг",
      // Кастомный рендеринг бейджа рейтинга с цветовой индикацией
      render: (emp: EmployeeWithRating) => {
        const rating = emp.rating || 0;
        let ratingClass = styles.RatingMedium;
        if (rating >= 8) ratingClass = styles.RatingHigh;
        else if (rating < 5) ratingClass = styles.RatingLow;

        return (
          <span className={`${styles.RatingBadge} ${ratingClass}`}>
            {rating.toFixed(1)}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <Preloader fullScreen />;
  }

  if (error) {
    return (
      <div className={styles.Container}>
        <div className={styles.Error}>{error}</div>
        <Link to="/" className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <Link to="/departments" className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Link>
        <h1 className={styles.Title}>{department?.name}</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div className={styles.ChartCard}>
        {/* Визуализация распределения сотрудников по качеству работы и рейтингу */}
        <h2 className={styles.ChartTitle}>График рейтинга сотрудников</h2>
        <div className={styles.ChartContainer}>
          {employees.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a3a" />
                <XAxis
                  type="number"
                  dataKey="quality"
                  name="Кол-во задач"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a0a0a0", fontSize: 12 }}
                  label={{ value: "Кол-во задач", position: "insideBottom", offset: -20, fill: "#a0a0a0", fontSize: 13 }}
                />
                <YAxis
                  type="number"
                  dataKey="rating"
                  name="Рейтинг"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a0a0a0", fontSize: 12 }}
                  label={{ value: "Рейтинг", angle: -90, position: "insideLeft", offset: -10, fill: "#a0a0a0", fontSize: 13 }}
                />
                <ZAxis type="number" range={[100, 100]} />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#2a2a3a" }} />
                <Scatter
                  name="Сотрудники"
                  data={employees}
                  fill="#62ba93"
                />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.error} style={{ background: 'transparent', border: 'none', color: '#a0a0a0' }}>Нет сотрудников для отображения графика</div>
          )}
        </div>
      </div>

      {/* Список сотрудников отдела в табличном формате */}
      <div className={styles.TableCard}>
        <h2 className={styles.TableTitle}>Рейтинги сотрудников</h2>
        <Table 
           data={employees} 
           columns={columns} 
           itemsPerPage={5}
           onRowClick={(emp) => navigate(`/employees/${emp.id}`)}
        />
      </div>
    </div>
  );
};

export default DepartmentViewPage;
