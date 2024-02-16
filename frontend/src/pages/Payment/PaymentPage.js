import React, { useState, useEffect } from "react";
import classes from "./paymentPage.module.css";
import {
  cashOnDelivery,
  getNewOrderForCurrentUser,
  initiatePayment,
} from "../../services/OrderService"; // Import initiatePayment
import Title from "../../Component/Title/Title";
import OrderItemsList from "../../Component/OrderItemsList/OrderItemsList";
import Map from "../../Component/Map/Map";
import { Button } from "antd";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [order, setOrder] = useState();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getNewOrderForCurrentUser().then((data) => setOrder(data));
  }, []);

  const handlePayment = async () => {
    if (!order) return;
    try {
      const amountInPaisa = order.totalPrice * 100;
      const paymentInitiationResponse = await initiatePayment({
        amount: amountInPaisa,
        orderId: order.id,
        CustomerName: order.name,
      });
      window.location.href = paymentInitiationResponse.payment_url;
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };
  // Handle Cash on Delivery
  const handlePayOnDelivery = async () => {
    if (!order) return;
    try {
      await cashOnDelivery();
      clearCart();
      navigate(`/track/${order.id}`);
      toast.success("Order Saved Successfully", "Success");
    } catch (error) {
      console.error("Error processing cash on delivery:", error);
      alert("Failed to process cash on delivery."); // Placeholder for actual error handling
    }
  };

  if (!order) return null;

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <Title
            title="Order Form"
            fontSize="1.6rem"
            marginBottom="20px"
            marginTop="20px"
          />
          <div className={classes.summary}>
            <div>
              <h3>Name:</h3>
              <span>{order.name}</span>
            </div>
            <div>
              <h3>Address:</h3>
              <span>{order.address}</span>
            </div>
          </div>
          <OrderItemsList order={order} />
        </div>

        <div className={classes.map}>
          <Title
            title="Your Location"
            fontSize="1.6rem"
            marginBottom="20px"
            marginTop="20px"
          />
          <Map readonly={true} location={order.addressLatLng} />
        </div>

        <div className={classes.buttons_container}>
          <div className={classes.buttons}>
            <Button
              type="primary"
              onClick={handlePayment} // Add the click handler here
              style={{
                width: "300px",
                height: "50px",
                fontSize: "20px",
              }}
            >
              Pay by Khalti
            </Button>
            <Button
              type="secondary"
              onClick={handlePayOnDelivery} // This will be your new handler for pay on delivery
              style={{
                width: "300px",
                height: "50px",
                fontSize: "20px",
                backgroundColor: "#f0ad4e", // Example: orange background
                color: "#ffffff", // white text
                borderColor: "#eea236", // Example: darker orange border
              }}
            >
              Cash on Delivery
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
