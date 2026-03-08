/**
 * Страница управления списком сотрудников
 * Содержит таблицу со всеми сотрудниками, их показателями и инструментами управления
 */
import { useEffect, useState, useCallback, useRef } from "react";
import Table from "../../components/Table/Table";
import Preloader from "../../components/Preloader/Preloader";
import { DeleteEmployee, GetEmployees } from "../../api/Employees";
import type { EmployeesResponseType } from "../../types/Responses";
import type { Employee } from "../../interfaces/Employee";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { CirclePlus } from "lucide-react";
import styles from "./Employees.module.css";

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Минимальное время отображения прелоадера для предотвращения "моргания" интерфейса
  const MIN_LOADING_TIME = 1500;
  const loadingStartTime = useRef<number | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loadingStartTime.current = Date.now();

      const response: EmployeesResponseType = await GetEmployees();
      setEmployees(response.data);

      // Искусственное продление статуса загрузки для визуальной стабильности
      const elapsedTime = Date.now() - (loadingStartTime.current || 0);
      if (elapsedTime < MIN_LOADING_TIME) {
        setTimeout(() => {
          setLoading(false);
        }, MIN_LOADING_TIME - elapsedTime);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Ошибка при загрузке сотрудников");

      // Обработка задержки даже при возникновении ошибок запроса
      const elapsedTime = Date.now() - (loadingStartTime.current || 0);
      if (elapsedTime < MIN_LOADING_TIME) {
        setTimeout(() => {
          setLoading(false);
        }, MIN_LOADING_TIME - elapsedTime);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = useCallback(
    (employee: Employee) => {
      if (employee.id) {
        navigate(`/employees/edit/${employee.id}`);
      }
    },
    [navigate],
  );

  const handleDelete = useCallback(async (employee: Employee) => {
    if (!employee.id) return;

    if (
      window.confirm(
        `Удалить сотрудника ${employee.first_name} ${employee.second_name}?`,
      )
    ) {
      try {
        await DeleteEmployee(employee.id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        setError("Не удалось удалить сотрудника");
      }
    }
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#166534";
    if (rating >= 6) return "#b45309";
    if (rating >= 4) return "#92400e";
    return "#fa3636";
  };

  const getDelayColor = (delays: number) => {
    if (delays <= 2) return "#166534";
    if (delays <= 4) return "#b45309";
    if (delays <= 6) return "#92400e";
    return "#fa3636";
  };

  const renderRating = (value: number) => (
    <span
      style={{
        fontWeight: 600,
        color: getRatingColor(value),
        fontSize: "14px",
      }}
    >
      {value}
    </span>
  );

  const renderFullName = (item: Employee) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <span style={{ fontWeight: 600 }}>
        {item.surname} {item.first_name} {item.second_name}
      </span>
      {item.id && (
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          ID: {item.id}
        </span>
      )}
    </div>
  );

  const columns = [
    {
      key: "surname" as const,
      header: "Сотрудник",
      render: renderFullName,
      sortable: true,
    },
    {
      key: "revenue" as const,
      header: "Выручка",
      render: (item: Employee) => renderRating(item.revenue),
      sortable: true,
    },
    {
      key: "quality" as const,
      header: "Кол-во сделланых задач",
      render: (item: Employee) => renderRating(item.quality),
      sortable: true,
    },
    {
      key: "salary" as const,
      header: "Зарплата",
      render: (item: Employee) => (
        <span style={{ fontWeight: 600, fontSize: "14px" }}>
          {item.salary !== null && item.salary !== undefined 
            ? `${item.salary.toLocaleString()} ₽` 
            : "—"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "discipline" as const,
      header: "Кол-во опозданий",
      render: (item: Employee) => (
        <span
          style={{
            fontWeight: 600,
            color: getDelayColor(item.discipline),
            fontSize: "14px",
          }}
        >
          {item.discipline}
        </span>
      ),
      sortable: true,
    },
  ];

  const handleAddEmployee = useCallback(() => {
    navigate("/employees/create");
  }, [navigate]);

  const getRowKey = (item: Employee) => {
    if (item.id) return item.id;
    return `${item.first_name}-${item.second_name}-${item.surname || ""}`;
  };

  const renderActions = (
    <Button
      classNameText={styles.AddButtonText}
      onClick={() => handleAddEmployee()}
      type={"button"}
      text="Добавить"
      Icon={CirclePlus}
    />
  );

  return (
    <div style={{ padding: "20px" }}>
      {loading && <Preloader minimumDisplayTime={500} isLoading={loading} />}

      {/* Отображение уведомления об ошибке с кнопкой повторного запроса */}
      {error && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#ef4444",
            background: "#fee2e2",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <p>{error}</p>
          <Button
            type="button"
            text="Повторить попытку"
            onClick={fetchEmployees}
          />
        </div>
      )}

      {/* Основная таблица со списком сотрудников и их метриками */}
      {!loading && !error && (
        <Table<Employee>
          data={employees}
          columns={columns}
          title="Сотрудники"
          badge={`${employees.length} человек`}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
          loading={false}
          renderActions={renderActions}
          rowKey={getRowKey}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
