/**
 * Главная страница приложения - Дашборд аналитики
 * Отображает агрегированную статистику по отделам в виде графиков
 */
import { useState, useEffect, useMemo, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { GetDepartments } from "../../api/Department";
import { GetEmployees } from "../../api/Employees";
import type { Department } from "../../interfaces/Department";
import type { Employee } from "../../interfaces/Employee";
import Preloader from "../../components/Preloader/Preloader";
import styles from "./Home.module.css";

const BarTooltip = ({ active, payload, valuePrefix = "", valueSuffix = "" }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.Tooltip}>
        <p className={styles.TooltipName}>
          {data.name}
        </p>
        <p className={styles.TooltipStat}>
          {payload[0].name}: {valuePrefix}{payload[0].value.toLocaleString()}{valueSuffix}
        </p>
        <p className={styles.TooltipStat}>
          Количество сотрудников: {data.employeeCount}
        </p>
      </div>
    );
  }
  return null;
};

const DepartmentChart = ({ title, data, dataKey, name, valuePrefix = "", valueSuffix = "" }: any) => (
  <div className={styles.ChartWrapper}>
    <h3 className={styles.ChartTitle}>{title}</h3>
    <div style={{ width: "100%", height: 300, minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a3a" />
          <XAxis 
            dataKey="name" 
            hide={true}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a0a0a0", fontSize: 12 }}
          />
          <Tooltip 
            content={<BarTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
          />
          <Bar name={name} dataKey={dataKey} fill="#62ba93" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const HomePage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Константа для предотвращения слишком быстрого исчезновения загрузчика
  const MIN_LOADING_TIME = 1500;
  const loadingStartTime = useRef<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        loadingStartTime.current = Date.now();
        
        const [deptRes, empRes] = await Promise.all([
          GetDepartments(),
          GetEmployees(),
        ]);
        
        setDepartments(deptRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ошибка загрузки данных для дашборда"
        );
        console.error(err);
      } finally {
        // Искусственная задержка для плавности пользовательского интерфейса
        const elapsedTime = Date.now() - (loadingStartTime.current || 0);
        if (elapsedTime < MIN_LOADING_TIME) {
          setTimeout(() => {
            setLoading(false);
          }, MIN_LOADING_TIME - elapsedTime);
        } else {
          setLoading(false);
        }
      }
    };

    loadData();
  }, []);

  const departmentMetrics = useMemo(() => {
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
      const count = deptEmployees.length || 1; // Защита от деления на ноль при пустом отделе
      
      const totalRevenue = deptEmployees.reduce((sum, emp) => sum + emp.revenue, 0);
      const avgQuality = deptEmployees.reduce((sum, emp) => sum + emp.quality, 0) / count;
      const avgDiscipline = deptEmployees.reduce((sum, emp) => sum + emp.discipline, 0) / count;
      const avgExperience = deptEmployees.reduce((sum, emp) => sum + emp.experience_years, 0) / count;
      
      return {
        name: dept.name,
        totalRevenue,
        avgQuality: Number(avgQuality.toFixed(1)),
        avgDiscipline: Number(avgDiscipline.toFixed(1)),
        avgExperience: Number(avgExperience.toFixed(1)),
        employeeCount: deptEmployees.length
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [departments, employees]);

  if (loading) {
    return (
      <div className={styles.Container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
          <Preloader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.Container}>
        <div className={styles.Error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <h1 className={styles.Title}>Аналитика отделов</h1>

      <main className={styles.MainContent}>
        {departmentMetrics.length > 0 ? (
          <div className={styles.ChartsGrid}>
            <DepartmentChart 
              title="Сравнение выручки" 
              data={departmentMetrics} 
              dataKey="totalRevenue" 
              name="Суммарная выручка" 
              valueSuffix=" ₽" 
            />
            <DepartmentChart 
              title="Среднее время опоздания сотрудников" 
              data={departmentMetrics} 
              dataKey="avgQuality" 
              name="Среднее время опоздания сотрудников" 
              valueSuffix=" мин" 
            />
            <DepartmentChart 
              title="Средний уровень качества работы" 
              data={departmentMetrics} 
              dataKey="avgDiscipline" 
              name="Средний уровень качества работы" 
              valueSuffix=" %" 
            />
            <DepartmentChart 
              title="Средний опыт работы" 
              data={departmentMetrics} 
              dataKey="avgExperience" 
              name="Средний опыт работы" 
              valueSuffix=" лет" 
            />
          </div>
        ) : (
          <div className={styles.EmptyState}>Нет данных для сравнения</div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
