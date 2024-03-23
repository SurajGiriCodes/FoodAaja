import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import classes from "./profilePage.module.css";
import Title from "../../Component/Title/Title";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import ChangePassword from "../../Component/ChangePassword/ChangePassword";

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, updateProfile } = useAuth();

  const submit = (user) => {
    updateProfile(user);
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Update Profile" marginTop="20px" marginBottom="20px" />
        <form onSubmit={handleSubmit(submit)}>
          <Input
            defaultValue={user.name}
            type="text"
            label="Name"
            {...register("name", {
              required: true,
              minLength: 5,
            })}
            error={errors.name}
          />
          <Input
            defaultValue={user.address}
            type="text"
            label="Address"
            {...register("address", {
              required: true,
              minLength: 10,
            })}
            error={errors.address}
          />

          <Button type="submit" text="Update" backgroundColor="#009e84" />
        </form>

        <ChangePassword />
      </div>
    </div>
  );
}
