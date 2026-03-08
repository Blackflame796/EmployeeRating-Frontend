/**
 * Страница создания нового подразделения (отдела)
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../edit/DepartmentsEditPage.module.css";
import { ArrowBigLeft } from "lucide-react";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { CreateDepartment } from "../../../api/Department";
import Preloader from "../../../components/Preloader/Preloader";

const CreateDepartmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработка отправки формы создания отдела с валидацией
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Название отдела не может быть пустым");
      }
      
      await CreateDepartment({ name: formData.name });
      navigate("/departments");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании отдела",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <Link to="/departments" className={styles.ReturnButton}>
          <ArrowBigLeft size={28} />
        </Link>
        <h1 className={styles.Title}>Добавление отдела</h1>
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
          text={loading ? "Создание..." : "Создать"}
        />
      </form>

      {loading && <Preloader fullScreen />}
    </div>
  );
};

export default CreateDepartmentPage;
