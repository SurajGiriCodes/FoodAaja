import React, { useState, useEffect } from "react";
import classes from "./paymentPage.module.css";
import { getNewOrderForCurrentUser } from "../../services/OrderService";
import Title from "../../Component/Title/Title";
import OrderItemsList from "../../Component/OrderItemsList/OrderItemsList";
import Map from "../../Component/Map/Map";
import { Button } from "antd";

export default function PaymentPage() {
  const [order, setOrder] = useState();

  useEffect(() => {
    getNewOrderForCurrentUser().then((data) => setOrder(data));
  }, []);

  if (!order) return;

  // const handlePayment = () => {
  // //   let config = {
  // //     // the "publicKey" is provided by Khalti
  // //     publicKey: "Your_Khalti_Public_Key",
  // //     productIdentity: "1234567890",
  // //     productName: "Your Product Name",
  // //     productUrl: "http://localhost:3000/payment",
  // //     eventHandler: {
  // //       onSuccess(payload) {
  // //         // Here, you can handle what happens after successful payment
  // //         console.log(payload);
  // //         // Typically, you send payload to your server for verification
  // //       },
  // //       onError(error) {
  // //         console.log(error);
  // //       },
  // //       onClose() {
  // //         console.log("Widget is closing");
  // //       },
  // //     },
  // //     paymentPreference: [
  // //       "KHALTI",
  // //       "EBANKING",
  // //       "MOBILE_BANKING",
  // //       "CONNECT_IPS",
  // //       "SCT",
  // //     ],
  // //   };

  // //   let checkout = new KhaltiCheckout(config);
  // //   checkout.show({ amount: 1000 }); // amount in paisa
  // // };

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
              style={{
                width: "300px",
                height: "50px",
                fontSize: "20px",
              }}
              // onClick={handlePayment}
            >
              Pay by Khalti
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
