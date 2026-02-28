import { useEffect, useState, useCallback, useRef } from "react";
import Table from "../../components/Table/Table";
import Preloader from "../../components/Preloader/Preloader";
import { DeleteEmployee, GetEmployees } from "../../api/Employees";
import type { EmployeesResponseType } from "../../types/Responses";
import type { Employee } from "../../interfaces/Employee";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { CirclePlus } from "lucide-react";

const EmployeesPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Для предотвращения мерцания
    const MIN_LOADING_TIME = 1500;
    const loadingStartTime = useRef<number | null>(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            loadingStartTime.current = Date.now();
            
            const response: EmployeesResponseType = await GetEmployees();
            setEmployees(response.data);
            
            // Обеспечиваем минимальное время загрузки
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
            setError('Ошибка при загрузке сотрудников');
            
            // Даже при ошибке показываем прелоадер минимум MIN_LOADING_TIME
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

    const handleEdit = useCallback((employee: Employee) => {
        if (employee.id) {
            navigate(`/employees/edit/${employee.id}`);
        }
    }, [navigate]);

    const handleDelete = useCallback(async (employee: Employee) => {
        if (!employee.id) return;
        
        if (window.confirm(`Удалить сотрудника ${employee.first_name} ${employee.second_name}?`)) {
            try {
                await DeleteEmployee(employee.id);
                setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
            } catch (error) {
                console.error('Ошибка при удалении:', error);
                setError('Не удалось удалить сотрудника');
            }
        }
    }, []);


    const getRatingColor = (rating: number) => {
        if (rating >= 8) return '#166534';
        if (rating >= 6) return '#b45309';
        if (rating >= 4) return '#92400e';
        return '#991b1b';
    };

    const renderRating = (value: number, label: string) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: getRatingColor(value) }}>{value}</span>
            </div>
            <div style={{
                width: '100%',
                height: '6px',
                background: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${(value / 10) * 100}%`,
                    height: '100%',
                    background: getRatingColor(value),
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );

    const renderFullName = (item: Employee) => (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '2px'
        }}>
            <span style={{ fontWeight: 600 }}>
                {item.surname} {item.first_name} {item.second_name}
            </span>
            {item.id && (
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                    ID: {item.id}
                </span>
            )}
        </div>
    );

    const columns = [
        {
            key: 'surname' as const,
            header: 'Сотрудник',
            render: renderFullName,
            sortable: true
        },
        {
            key: 'revenue' as const,
            header: 'Выручка',
            render: (item: Employee) => renderRating(item.revenue, 'Выручка'),
            sortable: true
        },
        {
            key: 'quality' as const,
            header: 'Качество',
            render: (item: Employee) => renderRating(item.quality, 'Качество'),
            sortable: true
        },
        {
            key: 'discipline' as const,
            header: 'Дисциплина',
            render: (item: Employee) => renderRating(item.discipline, 'Дисциплина'),
            sortable: true
        },
    ];

    const handleAddEmployee = useCallback(() => {
        navigate('/employees/create');
    }, [navigate]);

    const getRowKey = (item: Employee) => {
        if (item.id) return item.id;
        return `${item.first_name}-${item.second_name}-${item.surname || ''}`;
    };

    const renderActions = (
        <Button onClick={() => handleAddEmployee()} type={"button"} text="Добавить"><CirclePlus /></Button>
    );

    return (
        <div style={{ padding: '20px' }}>
            {loading && (
                <Preloader
                    minimumDisplayTime={500}
                    isLoading={loading}
                />
            )}

            {/* Ошибка */}
            {error && !loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#ef4444',
                    background: '#fee2e2',
                    borderRadius: '8px',
                    margin: '20px'
                }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchEmployees}
                        style={{
                            marginTop: '16px',
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Повторить попытку
                    </button>
                </div>
            )}

            {/* Таблица */}
            {!loading && !error && (
                <Table<Employee>
                    data={employees}
                    columns={columns}
                    title="Сотрудники"
                    badge={`${employees.length} человек`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={false}
                    renderActions={renderActions}
                    rowKey={getRowKey}
                />
            )}
        </div>
    );
};

export default EmployeesPage;