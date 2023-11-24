import React, { useState } from "react";

import classes from "./foodForm.modul.css";

const FoodForm = ({ restaurants }) => {
  // const [foodData, setFoodData] = useState({
  //   name: "",
  //   price: "",
  //   tags: "",
  //   details: "",
  // });

  // const [selectedRestaurant, setSelectedRestaurant] = useState("");

  // const handleInputChange = (e) => {
  //   setFoodData({ ...foodData, [e.target.name]: e.target.value });
  // };

  // const handleSelectChange = (e) => {
  //   setSelectedRestaurant(e.target.value);
  // };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   // Assume validation is performed before submitting
  //   const newFoodItem = { ...foodData };
  //   // Find the selected restaurant
  //   const restaurant = restaurants.find((r) => r.name === selectedRestaurant);
  //   if (restaurant) {
  //     // Update the restaurant's menu with the new food item
  //     restaurant.menu.push(newFoodItem);
  //   }
  //   // Clear form data after submission
  //   setFoodData({ name: "", price: "", tags: "", details: "" });
  // };

  return (
    <div className={classes.formContainer}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>Add Food Item</h2>
        <div
          style={{
            width: "5rem",
            height: "0.25rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "-10px",
            backgroundColor: "rgb(22, 136, 54)",
          }}
        ></div>
      </div>

      <form className="form">
        <label>
          Restaurant:
          {/* <select onChange={handleSelectChange} value={selectedRestaurant}>
            <option value="" disabled>
              Select a restaurant
            </option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.name} value={restaurant.name}>
                {restaurant.name}
              </option>
            ))}
          </select> */}
        </label>
        <br />
        <label>
          Food Name:
          <input
            type="text"
            name="name"
            // value={foodData.name}
            // onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="text"
            name="price"
            // value={foodData.price}
            // onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Tags:
          <input
            type="text"
            name="tags"
            // value={foodData.tags}
            // onChange={handleInputChange}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            name="imageUrl"
            accept="image/*"
            // onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Details:
          <textarea
            name="details"
            // value={foodData.details}
            // onChange={handleInputChange}
          />
        </label>
        <br />

        <br />
        <div class="button-container">
          <button type="submit">Add Food Item</button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
