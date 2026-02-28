import clsx from "clsx";
import styles from "./Button.module.css";

interface IButton {
  className?: string;
  href?: string;
  text?: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button = ({
  type = "button",
  className = "",
  disabled = false,
  children,
  onClick,
  ...props
}: IButton) => {
  let buttonElement = (
    <button
      type={type}
      className={clsx(styles.Button, className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
      {props.text && props.text}
    </button>
  );
  if (props.href) {
    return (
      <a href={props.href}>{buttonElement}</a>
    );
  } else {
    return buttonElement;
  }
};

export default Button;
