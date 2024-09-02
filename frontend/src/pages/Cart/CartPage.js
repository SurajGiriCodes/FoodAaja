import React from "react";
import { useCart } from "../../hooks/useCart";
import Title from "../../Component/Title/Title";
import classes from "./cartPage.module.css";
import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState
import { Modal, Button, Input, Checkbox, Row, Col } from "antd"; // Import Row and Col for layout
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [customizations, setCustomizations] = useState([]);
  const navigate = useNavigate();

  const showModal = (item) => {
    setCurrentItem(item);

    // Initialize a customization array based on the item's quantity
    const initialCustomizations = item.units // If the item has 'units' defined (which is probably an array), it maps each 'unit' to an object containing 'addIns' and 'customizationDetails'. If there are no 'units', it creates an array based on the item's 'quantity', with each entry being an object with default 'addIns' (empty array) and 'customizationDetails' (empty string).
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
      <Title
        title="Cart Page"
        margin="1.5rem 0 0 2.5rem"
        marginLeft="20px"
        marginTop="20px"
        marginBottom="20px"
      />

      {cart && cart.items.length > 0 ? (
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
      ) : (
        <div
          className={classes.emptyCartMessage}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: 100,
            height: "15rem",
          }}
        >
          <p>Cart Page Is Empty!</p>
          <button
            onClick={() => navigate("/")}
            style={{
              fontSize: "1rem",
              backgroundColor: "#007FFF",
              color: "white",
              borderRadius: "10rem",
              padding: "0.7rem 1rem",
              margin: "1rem",
              opacity: 0.8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.8;
              e.currentTarget.style.cursor = "default";
            }}
          >
            Go To Home Page
          </button>
        </div>
      )}
      <Modal
        open={isModalVisible}
        title={`Customize Your ${currentItem ? currentItem.food.name : ""}`}
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
            <div key={index} style={{ paddingBottom: "20px" }}>
              <div style={{ paddingBottom: "5px" }}>
                <h3>Customization for item #{index + 1}</h3>
              </div>

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
                      <div style={{ paddingTop: "10px" }}>
                        <p>Add-Ins:</p>
                      </div>

                      <Row gutter={[16, 16]}>
                        {currentItem.food.addIns.map((addIn, addInIndex) => (
                          <Col key={addInIndex} style={{ paddingTop: "5px" }}>
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
