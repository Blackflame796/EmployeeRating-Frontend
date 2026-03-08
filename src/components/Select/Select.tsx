/**
 * Кастомный компонент выпадающего списка
 * Реализует удобный выбор опций с поддержкой закрытия при клике вне области компонента
 */
import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.css";
import { ChevronDown } from "lucide-react";

interface SelectOption {
    value: number | string;
    label: string;
}

interface SelectProps {
    id: string;
    name: string;
    value: number | string;
    onChange: (e: { target: { name: string; value: string } }) => void;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

const Select = ({
    id,
    name,
    value,
    onChange,
    options,
    label,
    placeholder,
    required = false,
    className = "",
}: SelectProps) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setOpen(prev => !prev);

    const handleOptionClick = (val: number | string) => {
        onChange({ target: { name, value: val as string } });
        setOpen(false);
    };

    // Эффект для закрытия списка при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={styles.FormGroup} ref={wrapperRef}>
            {label && (
                <label htmlFor={id} className={styles.Label}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <div
                className={`${styles.SelectControl} ${className}`}
                onClick={handleToggle}
                tabIndex={0}
            >
                <span className={styles.SelectedText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={20} />
            </div>
            {open && (
                <ul className={styles.OptionsList}>
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            className={styles.Option}
                            onClick={() => handleOptionClick(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
