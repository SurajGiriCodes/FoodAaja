import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByID } from "../../services/foodService";

import classes from "../../pages/Menu/menu.module.css";
import { Modal, Button, Form, Input, Select, notification, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteFoodId, setDeleteFoodId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const showDeleteModal = (foodId) => {
    console.log(foodId);
    setDeleteFoodId(foodId);
    setIsDeleteModalVisible(true);
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

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log(values);
    try {
      let updatedRestaurant;
      const foodValuesWithRestaurantInfo = {
        ...values,
        restaurantId: restaurantId, // Assuming restaurantId is available in the scope
      };
      if (selectedFood) {
        // Call a function to update the existing menu item
        updatedRestaurant = await updateFoodInRestaurant(
          restaurantId,
          selectedFood._id,
          foodValuesWithRestaurantInfo
        );
      } else {
        // Add a new menu item
        updatedRestaurant = await addFoodToRestaurant(
          restaurantId,
          foodValuesWithRestaurantInfo
        );
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchTerm);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("searchButton").click();
    }
  };

  const filteredMenu = resmenu.menu
    ? resmenu.menu.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
              <div className={classes.title} style={{ marginBottom: "80px" }}>
                <h1 className={classes.restrurent}>{resmenu.name}</h1>
                <h2 className={classes.menuTitle}>Menu</h2>
                <div className={classes.underline}></div>
              </div>
              <div style={styles.container}>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  style={styles.searchInput}
                />
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  style={styles.searchButton}
                  id="searchButton"
                >
                  Search
                </button>
              </div>
              <div className={classes["section-center"]}>
                {filteredMenu?.map((food) => (
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
                          onClick={() => showDeleteModal(food._id)}
                          style={{ flex: 1, marginRight: "5px" }}
                        >
                          Delete
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => showEditModal(food)}
                          style={{ flex: 1 }}
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
              <Option value="snacks">Snacks</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a category" mode="multiple" allowClear>
              <Option value="hot">Hot (for cold conditions)</Option>
              <Option value="cold">Cold (for hot conditions)</Option>
              <Option value="comfort">
                Comfort (for rainy/gloomy conditions)
              </Option>
              <Option value="refreshing">
                Refreshing (for hot conditions)
              </Option>
              <Option value="hearty">Hearty (for cold conditions)</Option>
              <Option value="easy-to-eat">
                Easy-to-Eat (for windy conditions)
              </Option>
              <Option value="bright-flavorful">
                Bright & Flavorful (for overcast conditions)
              </Option>
              <Option value="classics">
                Classics (suitable for all weather)
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.List name="addIns">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      fieldKey={[fieldKey, "name"]}
                      rules={[
                        { required: true, message: "Missing add-in name" },
                      ]}
                    >
                      <Input placeholder="Add-in Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "price"]}
                      fieldKey={[fieldKey, "price"]}
                      rules={[
                        { required: true, message: "Missing add-in price" },
                      ]}
                    >
                      <Input placeholder="Add-in Price" type="number" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Add-in
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="cancel" onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={() => {
              handleDelete(deleteFoodId);
              setIsDeleteModalVisible(false);
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this food item?</p>
      </Modal>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "-1rem",
    marginBottom: "2rem",

    "@media screen and (max-width: 1200px)": {
      marginLeft: "20px",
    },
  },
  searchInput: {
    borderRadius: "10rem 0 0 10rem",
    border: "none",
    height: "2rem",
    width: "20rem",
    backgroundColor: "#f1f1f1",
    padding: "1.2rem",
    fontSize: "1rem",
    fontWeight: "500",
    outline: "none",
    "@media screen and (max-width: 600px)": {
      width: "15rem",
    },
  },
  searchButton: {
    color: "grey",
    height: "2.5rem",
    width: "5rem",
    fontSize: "1rem",
    borderRadius: "0 10rem 10rem 0",
    border: "none",
    backgroundColor: "#FF4500",
    color: "white",
    opacity: "0.8",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "-1px",
    marginLeft: "-2px",
    "@media screen and (max-width: 600px)": {
      width: "4rem",
      padding: "3px 8px",
      fontSize: "0.8rem",
    },
  },
  searchIcon: {
    marginRight: "6px",
  },
};
