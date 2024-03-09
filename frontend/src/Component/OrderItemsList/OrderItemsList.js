import React from "react";
import { Link } from "react-router-dom";
import classes from "./orderItemsList.module.css";

export default function OrderItemsList({ order }) {
  console.log(order);
  return (
    <table className={classes.table}>
      <tbody>
        <tr>
          <td colSpan="5">
            <h3>Order Items:</h3>
          </td>
        </tr>
        {order.items.map((item, index) => (
          <>
            <tr key={index}>
              <td>
                <Link to={`/food/${item.food.id}`}>
                  <img src={item.food.menuImageUrl} alt={item.food.name} />
                </Link>
              </td>
              <td>{item.food.name}</td>
              <td>Rs: {item.food.price}</td>
              <td>{item.quantity}</td>
              <td>Rs: {item.price}</td>
            </tr>
            {/* Display customization details in a new row */}
            {item.customizationDetails && (
              <tr key={`customization-${index}`}>
                <td colSpan="5" className={classes.customizationDetails}>
                  Customization: {item.customizationDetails}
                </td>
              </tr>
            )}
          </>
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
