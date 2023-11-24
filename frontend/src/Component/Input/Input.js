import React from "react";
import InputContainer from "../InputContainer/InputContainer";
import classes from "./input.module.css";

//input parameter
function input(
  { label, type, defaultValue, onChange, onBlur, name, error },
  ref
) {
  const getErrorMessage = () => {
    if (!error) return; //if no error return no error
    if (error.message) return error.message; //if  error return error

    //if error is not define return default base on there type
    //defaults
    switch (error.type) {
      case "required":
        return "This Field Is Required";
      case "minLength":
        return "Field Is Too Short";
      default:
        return "*";
    }
  };

  return (
    //the things we are passing to the input component we are using it inside this input
    <InputContainer label={label}>
      <input
        defaultValue={defaultValue}
        className={classes.input}
        type={type}
        placeholder={label}
        ref={ref}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className={classes.error}>{getErrorMessage()}</div>}
    </InputContainer>
  );
}

export default React.forwardRef(input);
//we need to do this whenever we have something like input inside
//our custome component and we want to forward its reference to its
//parent component
