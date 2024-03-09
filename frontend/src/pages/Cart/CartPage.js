import React from "react";
import { useCart } from "../../hooks/useCart";
import Title from "../../Component/Title/Title";
import classes from "./cartPage.module.css";
import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState
import {
  Modal,
  Button,
  Input,
  Checkbox,
  List,
  Row,
  Col,
  InputNumber,
} from "antd"; // Import Row and Col for layout

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [customizations, setCustomizations] = useState([]);

  const showModal = (item) => {
    setCurrentItem(item);

    // Initialize a customization array based on the item's quantity
    const initialCustomizations = item.units
      ? item.units.map((unit) => ({
          addIns: unit.addIns || [],
          customizationDetails: unit.customizationDetails || "",
        }))
      : Array.from({ length: item.quantity }, () => ({
          addIns: [],
          customizationDetails: "",
        }));

    setCustomizations(initialCustomizations);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    if (currentItem) {
      changeQuantity(currentItem, currentItem.quantity, customizations);
      setIsModalVisible(false);
    }
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
                    onChange={(e) => {
                      const newQuantity = Number(e.target.value);
                      changeQuantity(item, newQuantity);
                    }}
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
        {currentItem &&
          customizations.map((customization, index) => (
            <div key={index}>
              <h3>Customization for item #{index + 1}:</h3>
              <Input.TextArea
                rows={4}
                value={customization.customizationDetails}
                onChange={(e) => {
                  const updatedCustomizations = [...customizations];
                  updatedCustomizations[index].customizationDetails =
                    e.target.value;
                  setCustomizations(updatedCustomizations);
                }}
                placeholder="Enter customization details"
              />
              <div>
                {currentItem.food.addIns &&
                  currentItem.food.addIns.length > 0 && (
                    <>
                      <p>Add-Ins:</p>
                      <Row gutter={[16, 16]}>
                        {currentItem.food.addIns.map((addIn, addInIndex) => (
                          <Col key={addInIndex}>
                            <Checkbox
                              checked={
                                !!customization.addIns.find(
                                  (ai) => ai.name === addIn.name
                                )
                              }
                              onChange={(e) => {
                                const updatedCustomizations = [
                                  ...customizations,
                                ];
                                const currentAddIns =
                                  updatedCustomizations[index].addIns;
                                if (e.target.checked) {
                                  updatedCustomizations[index].addIns = [
                                    ...currentAddIns,
                                    { ...addIn, quantity: 1 },
                                  ];
                                } else {
                                  updatedCustomizations[index].addIns =
                                    currentAddIns.filter(
                                      (ai) => ai.name !== addIn.name
                                    );
                                }
                                setCustomizations(updatedCustomizations);
                              }}
                            >
                              {addIn.name} - Rs {addIn.price}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
              </div>
            </div>
          ))}
      </Modal>
    </>
  );
}
