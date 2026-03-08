/**
 * Компонент строки таблицы
 * Отвечает за рендеринг данных в ячейках на основе конфигурации колонок
 */
import { type ReactNode } from "react";
import styles from "./Table.module.css";
import clsx from "clsx";
import Button from "../Button/Button";
import { Pencil, Trash2 } from "lucide-react";

export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
    sortable?: boolean;
    className?: string;
}

interface TableRowProps<T extends object> {
    item: T;
    columns: TableColumn<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onRowClick?: (item: T) => void;
    rowClassName?: string;
}

function TableRow<T extends object>({
    item, 
    columns, 
    onEdit, 
    onDelete,
    onRowClick,
    rowClassName 
}: TableRowProps<T>) {
    return (
        <tr 
            className={clsx(styles.Row, rowClassName, onRowClick && styles.ClickableRow)}
            onClick={() => onRowClick && onRowClick(item)}
        >
            {columns.map((column) => {
                // Получение значения ячейки с учетом возможных пользовательских рендереров
                let value: ReactNode = null;
                
                // Проверка наличия ключа в объекте данных
                if (typeof column.key === 'string' && column.key in item) {
                    const propValue = item[column.key as keyof T];
                    // Сериализация объектов или прямое использование примитивов
                    if (propValue !== undefined && propValue !== null) {
                        if (typeof propValue === 'object') {
                            value = JSON.stringify(propValue);
                        } else {
                            value = propValue as ReactNode;
                        }
                    }
                }
                
                return (
                    <td key={String(column.key)} className={clsx(styles.Cell, column.className)}>
                        {column.render 
                            ? column.render(item) 
                            : value ?? ''}
                    </td>
                );
            })}
            {(onEdit || onDelete) && (
                <td className={clsx(styles.Cell, styles.ActionsCell)}>
                    <div className={styles.Actions}>
                        {onEdit && (
                            <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onEdit(item); }} type={"button"} className={styles.ActionButton}><Pencil width={20} height={20}/></Button>
                        )}
                        {onDelete && (
                            <Button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onDelete(item); }} className={clsx(styles.ActionButton, styles.DeleteButton)}><Trash2/></Button>
                        )}
                    </div>
                </td>
            )}
        </tr>
    );
}

export default TableRow;