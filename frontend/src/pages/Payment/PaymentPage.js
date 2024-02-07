import React, { useState, useEffect } from "react";
import classes from "./paymentPage.module.css";
import {
  getNewOrderForCurrentUser,
  initiatePayment,
} from "../../services/OrderService"; // Import initiatePayment
import Title from "../../Component/Title/Title";
import OrderItemsList from "../../Component/OrderItemsList/OrderItemsList";
import Map from "../../Component/Map/Map";
import { Button } from "antd";

export default function PaymentPage() {
  const [order, setOrder] = useState();

  useEffect(() => {
    getNewOrderForCurrentUser().then((data) => setOrder(data));
  }, []);

  const handlePayment = async () => {
    if (!order) return; // Check if the order exists
    try {
      // Assuming your order object has 'amount' and 'id' fields
      // Convert the amount to paisa if it's in another currency unit
      const amountInPaisa = order.amount * 100; // Example conversion, adjust as necessary
      const paymentInitiationResponse = await initiatePayment({
        amount: amountInPaisa,
        orderId: order.id, // Make sure you have an orderId or similar unique identifier
      });
      // Redirect the user to Khalti payment page
      window.location.href = paymentInitiationResponse.url; // Adjust according to the actual response structure
    } catch (error) {
      console.error("Error initiating payment:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  if (!order) return null; // or a loading spinner

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <Title title="Order Form" fontSize="1.6rem" />
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
          <Title title="Your Location" fontSize="1.6rem" />
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
          </div>
        </div>
      </div>
    </>
  );
}
