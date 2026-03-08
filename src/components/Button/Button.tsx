/**
 * Универсальный компонент кнопки
 * Поддерживает иконки, текстовое содержимое и может рендериться как ссылка
 */
import clsx from "clsx";
import styles from "./Button.module.css";

interface ButtonProps {
  className?: string;
  classNameText?: string;
  classNameIcon?: string;
  href?: string;
  text?: string;
  type: "button" | "submit" | "reset";
  Icon?: React.ElementType;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  Icon,
  classNameIcon = "",
  type = "button",
  className = "",
  classNameText = "",
  disabled = false,
  text = "",
  href,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const content = (
    <>
      {children}
      {Icon && (
        <Icon 
          className={clsx(
            classNameIcon, 
            text && text !== "" ? styles.Icon : ""
          )} 
        />
      )}
      {text && (
        <span className={classNameText}>
          {text}
        </span>
      )}
    </>
  );

  const buttonProps = {
    type,
    className: clsx(styles.Button, className),
    onClick,
    disabled,
    ...props,
  };

  if (href) {
    return (
      <a href={href} className={styles.LinkWrapper}>
        <button {...buttonProps}>
          {content}
        </button>
      </a>
    );
  }

  return (
    <button {...buttonProps}>
      {content}
    </button>
  );
};

export default Button;
