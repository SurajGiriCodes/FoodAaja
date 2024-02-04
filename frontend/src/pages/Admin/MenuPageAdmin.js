import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByID } from "../../services/foodService";
import classes from "../../pages/Menu/menu.module.css";
import { Modal, Button, Form, Input, Select, notification } from "antd";
import {
  addFoodToRestaurant,
  deleteFoodFromRestaurant,
  updateFoodInRestaurant,
} from "../../services/foodService";
const { Option } = Select;

export default function MenuPageAdmin() {
  const [resmenu, setResMenu] = useState({});
  const { restaurantId } = useParams();
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    console.log("Restaurant ID:", restaurantId);
    getByID(restaurantId).then(setResMenu);
  }, [restaurantId]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showEditModal = (food) => {
    setSelectedFood(food);
    form.setFieldsValue({ ...food });
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!isModalVisible) {
      setSelectedFood(null);
      form.resetFields();
    }
  }, [isModalVisible, form]);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      let updatedRestaurant;
      if (selectedFood) {
        // Call a function to update the existing menu item
        updatedRestaurant = await updateFoodInRestaurant(
          restaurantId,
          selectedFood._id,
          values
        );
      } else {
        // Add a new menu item
        updatedRestaurant = await addFoodToRestaurant(restaurantId, values);
      }
      setResMenu(updatedRestaurant);
      setIsModalVisible(false);
      notification.success({
        message: `Menu item ${
          selectedFood ? "updated" : "added"
        } successfully!`,
        duration: 4,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to ${
          selectedFood ? "update" : "add"
        } the menu item.`,
        duration: 4,
      });
    }
  };

  const handleDelete = async (foodId) => {
    try {
      await deleteFoodFromRestaurant(restaurantId, foodId);
      setResMenu((prevResMenu) => ({
        ...prevResMenu,
        menu: prevResMenu.menu.filter((food) => food._id !== foodId),
      }));

      notification.success({
        message: "Menu item deleted successfully",
        duration: 4,
      });
    } catch (error) {
      notification.error({
        message: "Error deleting menu item",
        description:
          "There was an error deleting the menu item. Please try again.",
        duration: 4,
      });
    }
  };

  return (
    <>
      <div>
        {resmenu && resmenu.menu && (
          <>
            <div style={{ textAlign: "right" }}>
              <Button type="primary" onClick={showModal}>
                Add Food
              </Button>
            </div>
            <section>
              <div className={classes.title}>
                <h1 className={classes.restrurent}>{resmenu.name}</h1>
                <h2 className={classes.menuTitle}>Menu</h2>
                <div className={classes.underline}></div>
              </div>
              <div className={classes["section-center"]}>
                {resmenu.menu.map((food) => (
                  <article key={food._id} className={classes["menu-item"]}>
                    <img
                      src={`${food.menuImageUrl}`}
                      alt={food.name}
                      className={classes.imgclass}
                    />
                    <div className={classes["items-info"]}>
                      <header>
                        <h4>{food.name}</h4>
                        <h4 className={classes.price}>RS {food.price}</h4>
                      </header>
                      <p className={classes["item-text"]}>{food.details}</p>
                      <div style={{ display: "flex" }}>
                        <Button
                          type="primary"
                          danger
                          onClick={() => handleDelete(food._id)}
                          style={{ flex: 1, marginRight: "5px" }} // Added inline style here
                        >
                          Delete
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => showEditModal(food)}
                          style={{ flex: 1 }} // Added inline style here
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Modal
        title={selectedFood ? "Edit Food Item" : "Add Food Item"}
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="menuImageUrl"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Tags" name="tags" rules={[{ required: true }]}>
            <Select
              mode="multiple" // Remove this line if only one tag should be selected
              placeholder="Select tags"
              allowClear
            >
              <Option value="breakfast">Breakfast</Option>
              <Option value="lunch">Lunch</Option>
              <Option value="dinner">Dinner</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}