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
  className?: string;
  loading?: boolean;
  renderActions?: ReactNode;
  rowKey?: keyof T | ((item: T) => string | number);
}

function Table<T extends object>({
  data,
  columns,
  title,
  itemsPerPage = 5,
  onEdit,
  onDelete,
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

  // Функция для получения уникального ключа строки
  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(item);
    }

    // Безопасно получаем значение ключа
    const keyValue = item[rowKey];

    // Проверяем, что keyValue - это string, number или можно преобразовать
    if (keyValue !== undefined && keyValue !== null) {
      if (typeof keyValue === "string" || typeof keyValue === "number") {
        return keyValue;
      }
      // Если это другой тип, преобразуем в строку
      return String(keyValue);
    }

    // Если ключ не найден, используем индекс
    return `row-${index}-${Date.now()}`;
  };

  // Сортировка данных
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];

    // Сортировка для разных типов
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

    // Сравнение boolean
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      if (sortConfig.direction === "ascending") {
        return aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        return aValue === bValue ? 0 : aValue ? -1 : 1;
      }
    }

    // Если типы разные или не поддерживаются
    return 0;
  });

  // Пагинация
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
    <div className={clsx(styles.container, className)}>
      {renderActions && (
        <div className={styles.ActionsContainer}>
          {renderActions && renderActions}
        </div>
      )}

      {/* Таблица */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() =>
                    column.sortable !== false && requestSort(String(column.key))
                  }
                  className={clsx(
                    styles.headerCell,
                    column.sortable !== false && styles.sortable,
                  )}
                >
                  <div className={styles.headerCellContainer}>
                    <span>{column.header}</span>
                    {column.sortable !== false && (
                      <span className={styles.sortIndicator}>
                        {getSortIndicator(String(column.key))}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className={styles.headerCell}>Действия</th>
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
              />
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className={styles.emptyState}
                >
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
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
              className={clsx(currentPage === page && styles.activePage)}
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
