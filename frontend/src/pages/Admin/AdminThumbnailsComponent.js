import React, { useState, useEffect } from "react";
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
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredRestaurants = restaurant.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAll().then((restaurant) => {
      setRestaurant(restaurant);
    });
  }, []);

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

  const showDeleteModal = (restaurantId) => {
    console.log(restaurantId);
    setSelectedRestaurantId(restaurantId);
    setIsDeleteModalVisible(true);
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
    console.log("handleRemove", restaurantId);
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
      <div style={styles.container}>
        <input
          type="text"
          placeholder="Search restaurants..."
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
      <ul className={classes.list}>
        {filteredRestaurants.map((restaurant) => (
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
                        showDeleteModal(restaurant._id);
                        // handleRemove(restaurant._id);
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
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input the location!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ImageUrl"
            name="restaurantImageUrl"
            rules={[
              { required: true, message: "Please input the image URL!" },
              {
                type: "url",
                message: "Please enter a valid URL for the image!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirmation"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={() => {
              handleRemove(selectedRestaurantId);
              setIsDeleteModalVisible(false);
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this restaurant?</p>
      </Modal>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "3rem",
    marginBottom: "1.5rem",

    "@media screen and (max-width: 1200px)": {
      marginLeft: "20px",
    },
  },
  searchInput: {
    borderRadius: "10rem 0 0 10rem",
    border: "none",
    height: "3rem",
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
    height: "3rem",
    width: "5rem",
    fontSize: "1rem",
    borderRadius: "0 10rem 10rem 0",
    border: "none",
    backgroundColor: "#5656ff",
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
