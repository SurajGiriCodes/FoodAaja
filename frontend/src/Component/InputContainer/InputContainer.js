////children prop is a special prop in React that allows you to include and render any content or components within the InputContainer component.

import classes from "./inputContainer.module.css";

export default function InputContainer({ label, bgColor, children }) {
  return (
    <div className={classes.container} style={{ backgroundColor: bgColor }}>
      <label className={classes.label}>{label}</label>
      <div className={classes.content}>{children}</div>
    </div>
  );
}
