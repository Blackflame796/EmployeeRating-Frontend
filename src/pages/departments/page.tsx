/**
 * Страница управления списком отделов
 * Предоставляет функционал просмотра, создания, редактирования и удаления отделов
 */
import { useEffect, useState, useCallback, useRef } from "react";
import Table from "../../components/Table/Table";
import Preloader from "../../components/Preloader/Preloader";
import { DeleteDepartment, GetDepartments } from "../../api/Department";
import type { DepartmentsResponseType } from "../../types/Responses";
import type { Department } from "../../interfaces/Department";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { CirclePlus } from "lucide-react";
import styles from "./Departments.module.css";

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Управление состоянием загрузки с защитой от мерцания UI
  const MIN_LOADING_TIME = 1500;
  const loadingStartTime = useRef<number | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      loadingStartTime.current = Date.now();

      const response: DepartmentsResponseType = await GetDepartments();
      setDepartments(response.data);

      // Принудительная задержка завершения загрузки для плавных переходов
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
      setError("Ошибка при загрузке отделов");

      // Логика задержки также применяется при возникновении ошибок
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
    fetchDepartments();
  }, [fetchDepartments]);

  const handleEdit = useCallback(
    (department: Department) => {
      if (department.id) {
        navigate(`/departments/edit/${department.id}`);
      }
    },
    [navigate],
  );

  const handleDelete = useCallback(async (department: Department) => {
    if (!department.id) return;

    if (window.confirm(`Удалить отдел ${department.name}?`)) {
      try {
        await DeleteDepartment(department.id);
        setDepartments((prev) =>
          prev.filter((dept) => dept.id !== department.id),
        );
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        setError("Не удалось удалить отдел");
      }
    }
  }, []);

  const renderName = (item: Department) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <span style={{ fontWeight: 600 }}>{item.name}</span>
      {item.id && (
        <span style={{ fontSize: "12px", color: "#64748b" }}>
          ID: {item.id}
        </span>
      )}
    </div>
  );

  const columns = [
    {
      key: "name" as const,
      header: "Отдел",
      render: renderName,
      sortable: true,
    },
  ];

  const handleAddDepartment = useCallback(() => {
    navigate("/departments/create");
  }, [navigate]);

  const getRowKey = (item: Department) => {
    if (item.id) return item.id;
    return `${item.name}`;
  };

  const renderActions = (
    <Button
      classNameText={styles.AddButtonText}
      onClick={() => handleAddDepartment()}
      type={"button"}
      text="Добавить"
      Icon={CirclePlus}
    />
  );

  return (
    <>
      {loading && <Preloader minimumDisplayTime={500} isLoading={loading} />}

      {/* Блок отображения критических ошибок загрузки данных */}
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
            onClick={fetchDepartments}
            text="Повторить попытку"
          />
        </div>
      )}

      {/* Основной контент страницы: таблица со списком отделов */}
      {!loading && !error && (
        <Table<Department>
          data={departments}
          columns={columns}
          title="Отделы"
          badge={`${departments.length} отделов`}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={(department) => navigate(`/departments/${department.id}`)}
          loading={false}
          renderActions={renderActions}
          rowKey={getRowKey}
        />
      )}
    </>
  );
};

export default DepartmentsPage;
