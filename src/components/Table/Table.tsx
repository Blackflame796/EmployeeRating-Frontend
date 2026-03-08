/**
 * Универсальный компонент таблицы с поддержкой сортировки и пагинации
 */
import { useState, type ReactNode } from "react";
import styles from "./Table.module.css";
import clsx from "clsx";
import TableRow, { type TableColumn } from "./TableRow";
import Button from "../Button/Button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

interface TableProps<T extends object> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  badge?: string;
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  className?: string;
  loading?: boolean;
  renderActions?: ReactNode;
  rowKey?: keyof T | ((item: T) => string | number);
}

function Table<T extends object>({
  data,
  columns,
  itemsPerPage = 5,
  onEdit,
  onDelete,
  onRowClick,
  className,
  renderActions,
  rowKey = "id" as keyof T,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  // Генерация уникального ключа для каждой строки таблицы
  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(item);
    }

    // Попытка извлечь значение ключа по заданному полю или функции
    const keyValue = item[rowKey];

    // Валидация типа ключа (должен быть строкой или числом)
    if (keyValue !== undefined && keyValue !== null) {
      if (typeof keyValue === "string" || typeof keyValue === "number") {
        return keyValue;
      }
      // Приведение к строке для нетривиальных типов
      return String(keyValue);
    }

    // Резервный вариант: использование индекса строки
    return `row-${index}-${Date.now()}`;
  };

  // Логика сортировки данных на основе текущей конфигурации
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];

    // Обработка различных типов данных для корректного сравнения
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }

    // Сравнение логических значений
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      if (sortConfig.direction === "ascending") {
        return aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        return aValue === bValue ? 0 : aValue ? -1 : 1;
      }
    }

    // Сохранение исходного порядка для несовместимых типов
    return 0;
  });

  // Расчет данных для текущей страницы
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className={clsx(styles.Container, className)}>
      {renderActions && (
        <div className={styles.ActionsContainer}>
          {renderActions && renderActions}
        </div>
      )}

      {/* Основная табличная часть */}
      <div className={styles.TableWrapper}>
        <table className={styles.Table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() =>
                    column.sortable !== false && requestSort(String(column.key))
                  }
                  className={clsx(
                    styles.HeaderCell,
                    column.sortable !== false && styles.Sortable,
                  )}
                >
                  <div className={styles.HeaderCellContainer}>
                    <span>{column.header}</span>
                    {column.sortable !== false && (
                      <span className={styles.SortIndicator}>
                        {getSortIndicator(String(column.key))}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className={styles.HeaderCell}>Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={getRowKey(item, index)}
                item={item}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                onRowClick={onRowClick}
              />
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className={styles.EmptyState}
                >
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Блок управления пагинацией */}
      {totalPages > 1 && (
        <div className={styles.Pagination}>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            type={"button"}
            className={styles.NextButton}
          >
            <ArrowBigLeft width={24} height={24} />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              type="button"
              key={page}
              onClick={() => setCurrentPage(page)}
              className={clsx(currentPage === page && styles.ActivePage)}
              text={String(page)}
            />
          ))}
          <Button
            type={"button"}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={styles.NextButton}
          >
            <ArrowBigRight width={24} height={24} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Table;
