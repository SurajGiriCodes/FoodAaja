import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { pay, trackOrderById } from "../../services/OrderService";
import NotFound from "../../Component/NotFound/NotFound";
import classes from "./orderTrackPage.module.css";
import DateTime from "../../Component/DateTime/DateTime";
import OrderItemsList from "../../Component/OrderItemsList/OrderItemsList";
import Title from "../../Component/Title/Title";
import Map from "../../Component/Map/Map";
import { useCart } from "../../hooks/useCart";
import queryString from "query-string";
import { toast } from "react-toastify";

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters from URL
  const queryParams = queryString.parse(location.search);

  const {
    status,
    transaction_id,
    amount,
    purchase_order_id,
    purchase_order_name,
  } = queryParams;

  React.useEffect(() => {
    const processPayment = async () => {
      if (status === "Completed") {
        try {
          const orderId = await pay(purchase_order_id);
          clearCart();
          toast.success("Payment Saved Successfully", "Success");
          navigate(location.pathname, { replace: true });
        } catch (error) {
          toast.error("Payment processing failed", "Error");
        }
      }
    };

    processPayment();
  }, [
    status,
    transaction_id,
    amount,
    purchase_order_id,
    purchase_order_name,
    clearCart,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    orderId &&
      trackOrderById(orderId).then((order) => {
        setOrder(order);
      });
  }, []);

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.content}>
          <h1>Order #{order.id}</h1>
          <div className={classes.header}>
            <div>
              <strong>Date</strong>
              <DateTime date={order.createdAt} />
            </div>
            <div>
              <strong>Name</strong>
              {order.name}
            </div>
            <div>
              <strong>Address</strong>
              {order.address}
            </div>
            <div className={classes.statusContainer}>
              <span>
                <span className={classes.statusLabel}>Status:</span>{" "}
                <span className={classes.statusValue}>{order.status}</span>
              </span>
              <span className={classes.statusDivider}>|</span>
              <span>
                <span className={classes.statusLabel}>Delivery:</span>{" "}
                <span className={classes.statusValue}>
                  {order.deliveryStatus}
                </span>
              </span>
            </div>

            {order.paymentId && (
              <div>
                <strong>Payment ID</strong>
                {order.paymentId}
              </div>
            )}
          </div>

          <OrderItemsList order={order} />
        </div>

        <div>
          <Title title="Your Location" fontSize="1.6rem" />
          <Map location={order.addressLatLng} readonly={true} />
        </div>

        {order.status === "NEW" && (
          <div className={classes.payment}>
            <Link to="/payment">Go To Payment</Link>
          </div>
        )}
      </div>
    )
  );
}
