import React from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createOrder } from "../../services/OrderService";
import classes from "./checkoutPage.module.css";
import Title from "../../Component/Title/Title";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import OrderItemsList from "../../Component/OrderItemsList/OrderItemsList";
import Map from "../../Component/Map/Map";
export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submit = async (data) => {
    if (!order.addressLatLng) {
      toast.warning("Please select your location on the map");
      return;
    }

    await createOrder({ ...order, name: data.name, address: data.address });
    navigate("/payment");
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className={classes.container}>
        <div className={classes.content}>
          <Title
            title="Order Form"
            fontSize="1.6rem"
            marginBottom="20px"
            marginTop="20px"
          />
          <div className={classes.inputs}>
            <Input
              defaultValue={user.name}
              label="Name"
              {...register("name")}
              error={errors.name}
            />
            <Input
              defaultValue={user.address}
              label="Address"
              {...register("address")}
              error={errors.address}
            />
          </div>
          <OrderItemsList order={order} />
        </div>
        <div>
          <Title
            title="Choose Your Location"
            fontSize="1.6rem"
            marginBottom="20px"
            marginTop="20px"
          />
          <Map
            location={order.addressLatLng}
            onChange={(latlng) => {
              console.log(latlng);
              setOrder({ ...order, addressLatLng: latlng });
            }}
          />
          <div className={classes.buttons_container}>
            <div className={classes.buttons}>
              <Button
                type="submit"
                text="Go To Payment"
                width="100%"
                height="3rem"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
