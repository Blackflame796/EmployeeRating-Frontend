/**
 * Страница редактирования информации об отделе
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./DepartmentsEditPage.module.css";
import { ArrowBigLeft } from "lucide-react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { GetDepartment, UpdateDepartment } from "../../../api/Department";
import Preloader from "../../../components/Preloader/Preloader";
import type { Department } from "../../../interfaces/Department";

const EditDepartmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Department>({
    name: ""
  });

  // Загрузка текущих данных отдела при инициализации страницы
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const departmentResponse = await GetDepartment(Number(id));

        setFormData(departmentResponse.data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Название отдела не может быть пустым");
      }

      await UpdateDepartment(Number(id), formData);
      navigate("/departments");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при обновлении отдела",
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
        <Link to="/departments" className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Link>
        <h1 className={styles.Title}>Редактирование отдела</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <form onSubmit={handleSubmit} className={styles.Form}>
        {error && <div className={styles.Error}>{error}</div>}

        <Input
          id="name"
          name="name"
          type="text"
          label="Название отдела"
          value={formData.name}
          onChange={handleChange}
          placeholder="Введите название отдела"
          required
        />

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

export default EditDepartmentPage;
