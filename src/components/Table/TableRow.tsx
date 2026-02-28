// src/components/Table/TableRow.tsx
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

interface TableRowProps<T extends object> {  // Добавляем ограничение
    item: T;
    columns: TableColumn<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    rowClassName?: string;
}

function TableRow<T extends object>({  // Добавляем ограничение
    item, 
    columns, 
    onEdit, 
    onDelete,
    rowClassName 
}: TableRowProps<T>) {
    return (
        <tr className={clsx(styles.row, rowClassName)}>
            {columns.map((column) => {
                // Безопасно получаем значение
                let value: ReactNode = null;
                
                // Проверяем, является ли ключ свойством объекта
                if (typeof column.key === 'string' && column.key in item) {
                    const propValue = item[column.key as keyof T];
                    // Преобразуем в ReactNode если нужно
                    if (propValue !== undefined && propValue !== null) {
                        if (typeof propValue === 'object') {
                            value = JSON.stringify(propValue);
                        } else {
                            value = propValue as ReactNode;
                        }
                    }
                }
                
                return (
                    <td key={String(column.key)} className={clsx(styles.cell, column.className)}>
                        {column.render 
                            ? column.render(item) 
                            : value ?? ''}
                    </td>
                );
            })}
            {(onEdit || onDelete) && (
                <td className={clsx(styles.cell, styles.actionsCell)}>
                    <div className={styles.actions}>
                        {onEdit && (
                            <Button onClick={() => onEdit(item)} type={"button"} className={styles.ActionButton}><Pencil width={20} height={20}/></Button>
                        )}
                        {onDelete && (
                            <Button type="button" onClick={() => onDelete(item)} className={styles.ActionButton}><Trash2/></Button>
                        )}
                    </div>
                </td>
            )}
        </tr>
    );
}

export default TableRow;