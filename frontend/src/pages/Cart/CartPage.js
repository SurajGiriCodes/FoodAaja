import React from "react";
import { useCart } from "../../hooks/useCart";
import Title from "../../Component/Title/Title";
import classes from "./cartPage.module.css";
import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState
import { Modal, Button, Input } from "antd";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // To keep track of the item being customized
  const [customizationDetails, setCustomizationDetails] = useState("");

  const showModal = (item) => {
    setCurrentItem(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    if (currentItem && customizationDetails.trim() !== "") {
      changeQuantity(currentItem, currentItem.quantity, customizationDetails); // Pass customization details
    }
    setIsModalVisible(false);
    setCustomizationDetails(""); // Reset customization details
  };

  return (
    <>
      <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" marginLeft="20px" />
      {cart && cart.items.length > 0 && (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <div>
                  <img src={`${item.food.menuImageUrl}`} alt={item.food.name} />
                </div>
                <div>
                  <p>{item.food.name}</p>
                </div>

                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      changeQuantity(item, Number(e.target.value))
                    }
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </div>
                <div>
                  <p>RS {item.price}</p>
                </div>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => showModal(item)}
                  className={classes.customize_button}
                >
                  Customize
                </Button>
                <div>
                  <button
                    className={classes.remove_button}
                    onClick={() => removeFromCart(item.food._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={classes.checkout}>
            <div>
              <div className={classes.foods_count}>{cart.totalCount}</div>
              <div className={classes.total_price}>RS {cart.totalPrice}</div>
            </div>
            <Link to="/checkout">Proceed To Checkout</Link>
          </div>
        </div>
      )}
      <Modal
        title="Customize Food Item"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        {currentItem && (
          <>
            <p style={{ marginBottom: "10px" }}>
              Customize your {currentItem.food.name}
            </p>
            <Input.TextArea
              rows={4} // You can set the number of rows for the text area to determine its height
              placeholder="Enter customization details"
              value={customizationDetails}
              onChange={(e) => setCustomizationDetails(e.target.value)}
            />
          </>
        )}
      </Modal>
    </>
  );
}
