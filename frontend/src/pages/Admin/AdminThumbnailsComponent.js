import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../Component/StarRating/StarRating";
import classes from "../../Component/Thumbnails/thumbnails.module.css";
import { Modal, Button, Form, Input, notification } from "antd";
import { getAll } from "../../services/foodService";
import { useNavigate } from "react-router-dom";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "../../services/foodService";

export default function AdminThumbnailsComponent() {
  const [restaurant, setRestaurant] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    getAll().then((restaurant) => {
      setRestaurant(restaurant);
    });
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showEditModal = (restaurant) => {
    form.setFieldsValue({
      name: restaurant.name,
      location: restaurant.location,
      rating: restaurant.rating,
      restaurantImageUrl: restaurant.restaurantImageUrl,
      stars: restaurant.stars,
    });
    setSelectedRestaurant(restaurant);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRestaurant(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      let response;
      if (selectedRestaurant) {
        response = await updateRestaurant(selectedRestaurant._id, values);
      } else {
        response = await createRestaurant(values);
      }
      setRestaurant((prevRestaurants) => {
        if (selectedRestaurant) {
          return prevRestaurants.map((r) =>
            r._id === selectedRestaurant._id ? response : r
          );
        } else {
          return [...prevRestaurants, response];
        }
      });
      notification.success({
        message: `Restaurant ${
          selectedRestaurant ? "updated" : "added"
        } successfully!`,
        duration: 2,
      });
      form.resetFields();
      setIsModalVisible(false);
      setSelectedRestaurant(null); // Reset selected restaurant
    } catch (error) {
      notification.error({
        message: `Failed to ${
          selectedRestaurant ? "update" : "add"
        } restaurant. Please try again.`,
        duration: 2,
      });
    }
  };

  const handleRemove = async (restaurantId) => {
    try {
      await deleteRestaurant(restaurantId);
      // Re-fetch the restaurant list
      const updatedRestaurants = await getAll();
      setRestaurant(updatedRestaurants);
      notification.success({
        message: "Restaurant deleted successfully!",
        duration: 2,
      });

      // Update the state to remove the restaurant from the list
      setRestaurant((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant._id !== restaurantId)
      );
    } catch (error) {
      notification.error({
        message: "Failed to delete the restaurant. Please try again.",
        duration: 2,
      });
    }
  };

  const navigate = useNavigate();

  // Function to handle navigation to the admin menu
  const goToAdminMenu = (restaurantId) => {
    navigate(`/adminMenu/${restaurantId}`);
  };

  return (
    <>
      <div style={{ textAlign: "right", marginBottom: "-30px" }}>
        <Button type="primary" onClick={showModal}>
          Add Restaurants
        </Button>
      </div>
      <ul className={classes.list}>
        {restaurant.map((restaurant) => (
          <li key={restaurant.id}>
            <div
              onClick={() => goToAdminMenu(restaurant.id)}
              className={classes.clickableArea}
            >
              <img
                className={classes.image}
                src={restaurant.restaurantImageUrl}
                alt={restaurant.name}
              />

              <div className={classes.content}>
                <div className={classes.name}>{restaurant.name}</div>
                <span
                  className={`${classes.favorite} ${
                    restaurant.favorite ? "" : classes.not
                  }`}
                >
                  ❤
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className={classes.buttonContainer}
                  >
                    <StarRating stars={restaurant.stars} />
                    <Button
                      type="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        showEditModal(restaurant);
                      }}
                    >
                      Edit Restaurant
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={classes.origins}>
                      <span>{restaurant.location}</span>
                    </div>
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(restaurant._id);
                      }}
                    >
                      Delete Restaurant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal Form */}
      <Modal
        title={selectedRestaurant ? "Edit Restaurant" : "Add Restaurant"}
        open={isModalVisible}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Rating" name="rating" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="ImageUrl"
            name="restaurantImageUrl"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Stars" name="stars" rules={[{ required: true }]}>
            <Input />
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
