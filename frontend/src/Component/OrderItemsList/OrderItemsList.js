import React from "react";
import { Link } from "react-router-dom";

import classes from "./orderItemsList.module.css";

export default function OrderItemsList({ order }) {
  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td colSpan="5">
            <h3>Order Items:</h3>
          </td>
        </tr>
        {order.items.map((item) => (
          <tr key={item.food.id}>
            <td>
              <Link to={`/food/${item.food.id}`}>
                <img src={item.food.menuImageUrl} />
              </Link>
            </td>
            <td>{item.food.name}</td>
            <td>Rs: {item.food.price}</td>
            <td>{item.quantity}</td>
            <td>Rs: {item.price}</td>
          </tr>
        ))}

        <tr>
          <td colSpan="3"></td>
          <td>
            <strong>Total :</strong>
          </td>
          <td>Rs: {order.totalPrice}</td>
        </tr>
      </tbody>
    </table>
  );
}
