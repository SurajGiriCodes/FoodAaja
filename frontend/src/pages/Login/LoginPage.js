import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import classes from "./loginPage.module.css";
import Title from "../../Component/Title/Title";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";

export default function LoginPage() {
  const {
    handleSubmit, // is used to register input fields in your form with the form state
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl"); //getting query string

  const submit = async ({ email, password }) => {
    await login(email, password);
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Login" marginBottom="20px" marginTop="20px" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="email"
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                message: "Email Is Not Valid",
              },
            })}
            error={errors.email}
          />
          <Input
            type="password"
            label="Password"
            {...register("password", {
              required: true,
            })}
            error={errors.password}
          />

          <Button type="submit" text="Login" />
          <div className={classes.register}>
            New user ? &nbsp;
            <Link to={`/register?${returnUrl ? "returnUrl=" + returnUrl : ""}`}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
