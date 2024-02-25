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
  const [customizationDetails, setCustomizationDetails] = useState("");
  const [selectedAddIns, setSelectedAddIns] = useState([]);

  const showModal = (item) => {
    setCurrentItem({ ...item, addIns: item.addIns || [] });
    setSelectedAddIns(item.addIns || []);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle change in add-ins selection
  const handleAddInChange = (checked, item) => {
    if (checked) {
      setSelectedAddIns([...selectedAddIns, { ...item, quantity: 1 }]);
    } else {
      setSelectedAddIns(
        selectedAddIns.filter((addIn) => addIn.name !== item.name)
      );
    }
  };

  const handleOk = () => {
    if (currentItem) {
      changeQuantity(
        currentItem,
        currentItem.quantity,
        customizationDetails,
        selectedAddIns
      );
      setIsModalVisible(false);
      setCustomizationDetails("");
      setSelectedAddIns([]);
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
              rows={4}
              placeholder="Enter customization details"
              value={customizationDetails}
              onChange={(e) => setCustomizationDetails(e.target.value)}
            />
            {currentItem.food.addIns && currentItem.food.addIns.length > 0 ? (
              <>
                <p style={{ margin: "10px 0" }}>Add-Ins:</p>
                <Row gutter={[16, 16]}>
                  {currentItem.food.addIns.map((item) => (
                    <Col key={item.name}>
                      <Checkbox
                        onChange={(e) =>
                          handleAddInChange(e.target.checked, item)
                        }
                        checked={selectedAddIns.some(
                          (addIn) => addIn.name === item.name
                        )}
                      >
                        {item.name} - Rs {item.price}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <p style={{ margin: "10px 0" }}>No add-ins available.</p>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
