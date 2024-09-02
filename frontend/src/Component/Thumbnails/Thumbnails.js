import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "../StarRating/StarRating";
import classes from "./thumbnails.module.css";
import { Modal, Rate, Button } from "antd";
import {
  getUserOrders,
  submitRatingsToBackend,
  getAllOrdersOfAllUsers,
} from "../../services/OrderService";
import {
  getAllRestaurantIds,
  updateRestaurantRatings,
} from "../../services/foodService";
import backgroundImage from "../../images/background.png";

export default function Thumbnails({ restaurant }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchRestaurantIdAndData = async () => {
      try {
        const RestaurantIds = await getAllRestaurantIds();
        const allRestaurantIds = [];
        RestaurantIds.forEach((restaurant) => {
          allRestaurantIds.push(restaurant._id);
        });

        const orders = await getAllOrdersOfAllUsers();
        const foodItemsByRestaurant = [];
        orders.forEach((order) => {
          order.items.forEach((item) => {
            const { food, rating } = item;

            if (
              rating !== null &&
              allRestaurantIds.includes(food.restaurantId)
            ) {
              const restaurantId = food.restaurantId;
              if (!foodItemsByRestaurant[restaurantId]) {
                foodItemsByRestaurant[restaurantId] = [];
              }
              foodItemsByRestaurant[restaurantId].push({ food, rating });
            }
          });
        });
        const restaurantRatings = {};
        for (const restaurantId in foodItemsByRestaurant) {
          const items = foodItemsByRestaurant[restaurantId];
          const totalRating = items.reduce((acc, curr) => acc + curr.rating, 0);
          const averageRating = totalRating / items.length;
          restaurantRatings[restaurantId] = averageRating;
        }
        await updateRestaurantRatings(restaurantRatings);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchRestaurantIdAndData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);
        const userId = user.id;
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }
        const response = await getUserOrders(userId);
        const mostRecentOrder = response[0];
        console.log(mostRecentOrder);

        if (mostRecentOrder) {
          setRecentOrder(mostRecentOrder);
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleRatingChange = (foodItemId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [foodItemId]: rating,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare ratings data for submission
      const ratingsWithOrderAndFoodId = recentOrder.items.map((item) => ({
        orderId: recentOrder._id,
        foodItemId: item.food._id,
        rating: ratings[item.food._id],
      }));
      await submitRatingsToBackend(ratingsWithOrderAndFoodId);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to submit ratings:", error);
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div
          className={classes.background}
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        <ul className={classes.list}>
          {restaurant.map((restaurant) => (
            <li key={restaurant.id}>
              <Link
                to={`/menu/${restaurant.id}`}
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
                  <div className={classes.stars}>
                    <StarRating stars={restaurant.rating} />
                  </div>
                  <div className={classes.product_item_footer}>
                    <div className={classes.origins}>
                      <span>{restaurant.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        title="Please give your Rating"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
        style={{ textAlign: "center" }}
      >
        <div>
          {recentOrder && (
            <div
              style={{ textAlign: "left" }}
              className={classes.orderRatingContainer}
            >
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {recentOrder.items.map((item) => {
                  const orderedRestaurant = restaurant.find(
                    (rest) => rest.id === item.food.restaurantId
                  );

                  return (
                    <li key={item.food._id} style={{ marginBottom: "10px" }}>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "5px",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "10px",
                                }}
                              >
                                Food Item:
                              </span>
                              <span>{item.food.name}</span>
                            </div>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "10px",
                                }}
                              >
                                Restaurant:
                              </span>
                              <span>
                                {orderedRestaurant
                                  ? orderedRestaurant.name
                                  : ""}
                              </span>
                            </div>
                          </div>

                          <div style={{ marginLeft: "10px" }}>
                            <Rate
                              allowHalf
                              defaultValue={0}
                              onChange={(rating) =>
                                handleRatingChange(item.food._id, rating)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
