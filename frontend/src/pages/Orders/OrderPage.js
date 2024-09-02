import React, { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllOrders, getAllStatus } from "../../services/OrderService";
import Title from "../../Component/Title/Title";
import classes from "./ordersPage.module.css";
import DateTime from "../../Component/DateTime/DateTime";
import NotFound from "../../Component/NotFound/NotFound";
import backgroundImage from "../../images/backOrder.png";
import backgroundImageFood from "../../images/FoodNeplai.png";

const initialState = {};
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ALL_STATUS_FETCHED":
      return { ...state, allStatus: payload };
    case "ORDERS_FETCHED":
      return { ...state, orders: payload };
    default:
      return state;
  }
};

export default function OrderPage() {
  const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);
  const { filter } = useParams();
  const [showBackground, setShowBackground] = useState(
    window.innerWidth >= 1300
  );

  useEffect(() => {
    getAllStatus().then((status) => {
      dispatch({ type: "ALL_STATUS_FETCHED", payload: status });
    });
    getAllOrders(filter).then((orders) => {
      dispatch({ type: "ORDERS_FETCHED", payload: orders });
    });

    // Event listener for window resize
    const handleResize = () => {
      setShowBackground(window.innerWidth >= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [filter]);
  return (
    <>
      <div
        style={{
          backgroundImage: showBackground ? `url(${backgroundImage})` : "none",
          backgroundSize: "100%",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        <div className={classes.container}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: showBackground ? "410px" : "0px",
            }}
          >
            <Title
              title="Orders"
              margin="1.5rem 0 0 .2rem"
              fontSize="1.9rem"
              marginTop="20px"
              marginBottom={showBackground ? "-20px" : "20px"}
              marginLeft="40px"
            />
            {showBackground && (
              <img
                src={backgroundImageFood}
                alt="Background Image"
                style={{ marginLeft: "250px" }}
              />
            )}
          </div>

          {allStatus && (
            <div className={classes.all_status}>
              <Link to="/orders" className={!filter ? classes.selected : ""}>
                All
              </Link>
              {allStatus.map((state) => (
                <Link
                  key={state}
                  className={state == filter ? classes.selected : ""}
                  to={`/orders/${state}`}
                >
                  {state}
                </Link>
              ))}
            </div>
          )}

          {orders?.length === 0 && (
            <NotFound
              linkRoute={filter ? "/orders" : "/"}
              linkText={filter ? "Show All" : "Go To Home Page"}
            />
          )}

          {orders &&
            orders.map((order) => (
              <div key={order.id} className={classes.order_summary}>
                <div className={classes.header}>
                  <span>{order.id}</span>
                  <span>
                    <DateTime date={order.createdAt} />
                  </span>
                  <span>{order.status}</span>
                </div>
                <div className={classes.items}>
                  {order.items.map((item) => (
                    <Link key={item.food.id} to={`/food/${item.food.id}`}>
                      <img src={item.food.menuImageUrl} alt={item.food.name} />
                    </Link>
                  ))}
                </div>
                <div className={classes.footer}>
                  <div>
                    <Link to={`/track/${order.id}`}>Show Order</Link>
                  </div>
                  <div>
                    <span className={classes.price}>Rs {order.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
