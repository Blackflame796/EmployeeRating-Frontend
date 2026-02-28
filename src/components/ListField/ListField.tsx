import styles from "./ListField.module.css";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { GetEmployees } from "../../api/Employees";
import type { EmployeesResponseType } from "../../types/Responses";
import type { Employee } from "../../interfaces/Employee";

interface ListFieldProps {
    className?: string;
}

const ListField = ({ className }: ListFieldProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Employee | null;
        direction: 'ascending' | 'descending';
    }>({
        key: null,
        direction: 'ascending'
    });
    
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const response: EmployeesResponseType = await GetEmployees();
                setEmployees(response.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Сортировка
    const sortedEmployees = [...employees].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'ascending' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'ascending' 
                ? aValue - bValue
                : bValue - aValue;
        }
        
        return 0;
    });

    // Пагинация
    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
    const paginatedEmployees = sortedEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const requestSort = (key: keyof Employee) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Employee) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'ascending' ? '↑' : '↓';
    };

    const handleEdit = (id: number) => {
        window.location.href = `/employees/edit/${id}`;
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить сотрудника?')) {
            try {
                // Здесь будет API запрос на удаление
                setEmployees(employees.filter(emp => emp.id !== id));
            } catch (error) {
                console.error('Ошибка при удалении:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className={clsx(styles.container, className)}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th onClick={() => requestSort('first_name')}>
                                Имя {getSortIndicator('first_name')}
                            </th>
                            <th onClick={() => requestSort('second_name')}>
                                Отчество {getSortIndicator('second_name')}
                            </th>
                            <th onClick={() => requestSort('surname')}>
                                Фамилия {getSortIndicator('surname')}
                            </th>
                            {/* <th onClick={() => requestSort('email')}>
                                Email {getSortIndicator('email')}
                            </th> */}
                            {/* <th>Статус</th> */}
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.map((employee: Employee) => (
                            <tr key={employee.id}>
                                <td>{employee.first_name}</td>
                                <td>{employee.second_name || '-'}</td>
                                <td>{employee.surname}</td>
                                {/* <td>{employee.email}</td> */}
                                {/* <td>
                                    <span className={clsx(
                                        styles.status,
                                        employee.isActive ? styles.active : styles.inactive
                                    )}>
                                        {employee.isActive ? 'Активен' : 'Неактивен'}
                                    </span>
                                </td> */}
                                <td>
                                    <div className={styles.actions}>
                                        <button 
                                            className={styles.editButton}
                                            onClick={() => handleEdit(employee.id || 0)}
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(employee.id || 0)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                    >
                        ←
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={clsx(
                                styles.pageButton,
                                currentPage === page && styles.activePage
                            )}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListField;