/**
 * Компонент текстового поля ввода
 * Поддерживает различные типы (text, number, email, password) и автоматическое выделение текста при фокусе для чисел
 */
import styles from "./Input.module.css";

interface InputProps {
    id: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "number" | "email" | "password";
    label?: string;
    placeholder?: string;
    required?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    className?: string;
}

const Input = ({
    id,
    name,
    value,
    onChange,
    type = "text",
    label,
    placeholder,
    required = false,
    min,
    max,
    step,
    className = "",
}: InputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "number") {
            // Убираем ведущие нули, если после них идет цифра (чтобы не ломать 0.5)
            e.target.value = e.target.value.replace(/^0+(?=\d)/, "");
        }
        onChange(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Автоматически выделяем весь текст при фокусе, если это число 0
        if (type === "number" && e.target.value === "0") {
            e.target.select();
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
        // Убираем фокус при прокрутке колесиком, чтобы избежать случайного изменения числа
        if (type === "number") {
            e.currentTarget.blur();
        }
    };

    return (
        <div className={styles.FormGroup}>
            {label && (
                <label htmlFor={id} className={styles.Label}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onWheel={handleWheel}
                className={`${styles.Input} ${className}`}
                required={required}
                placeholder={placeholder}
                {...(min !== undefined && { min })}
                {...(max !== undefined && { max })}
                {...(step !== undefined && { step })}
            />
        </div>
    );
};

export default Input;
