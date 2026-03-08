/**
 * Компонент индикатора загрузки (прелоадер)
 * Обеспечивает плавное появление и исчезновение, а также минимальное время отображения для избежания мерцания
 */
import React, { useEffect, useState } from 'react';
import styles from "./Preloader.module.css";
import clsx from "clsx";

interface PreloaderProps {
    fullScreen?: boolean;
    text?: string;
    className?: string;
    minimumDisplayTime?: number; // Минимально гарантированное время показа в миллисекундах
    isLoading?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({
    fullScreen = false,
    text = '',
    className,
    minimumDisplayTime = 500,
    isLoading = true
}) => {
    const [shouldRender, setShouldRender] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const startTime = React.useRef(Date.now());

    useEffect(() => {
        if (!isLoading) {
            const elapsedTime = Date.now() - startTime.current;
            
            if (elapsedTime < minimumDisplayTime) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => setShouldRender(false), 300);
                }, minimumDisplayTime - elapsedTime);
                
                return () => clearTimeout(timer);
            } else {
                setIsVisible(false);
                setTimeout(() => setShouldRender(false), 300);
            }
        }
    }, [isLoading, minimumDisplayTime]);

    if (!shouldRender) return null;

    const loaderElement = (
        <div className={clsx(
            styles.LoaderWrapper,
            !isVisible && styles.Hidden
        )}>
            <span className={styles.Loader} />
            {text && <div className={styles.Text}>{text}</div>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={clsx(styles.Container, className)}>
                {loaderElement}
            </div>
        );
    }

    return loaderElement;
};

export default Preloader;