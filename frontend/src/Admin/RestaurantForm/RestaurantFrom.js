import React, { useState } from "react";
import { createRestaurant } from "../../services/foodService";
import classes from "./restaurantForm.css";

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: "",
    restaurantImage: "",
    stars: "",
    menu: [],
  });

  const handleInputChange = (event, index) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      const file = files[0];
      //Update menuImage for a specific menu item
      if (name.includes("menu")) {
        const menuItems = [...formData.menu];
        const menuItem = menuItems[index] || {};
        menuItem[name.split("]")[1]] = file;
        menuItems[index] = menuItem;
        setFormData((prevFormData) => ({ ...prevFormData, menu: menuItems }));
      } else {
        //Update restaurantImage for the main restaurant
        setFormData((prevFormData) => ({ ...prevFormData, [name]: file }));
      }
    } else {
      // Handle non-file inputs
      if (name.includes("menu")) {
        const menuItems = [...formData.menu];
        const menuItem = menuItems[index] || {};
        menuItem[name.split("]")[1]] = value;
        menuItem[index] = menuItem;
        setFormData((prevFormData) => ({ ...prevFormData, menu: menuItems }));
      } else {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
      }
    }
  };

  const addMenuItem = () => {
    setFormData({
      ...formData, //This creates a shallow copy of the existing formData state using the spread operator
      menu: [
        //Within the copied state, it updates the menu property.
        ...formData.menu, //It uses the spread operator again to create a new array containing all the existing menu items
        { name: "", price: "", tags: "", menuImage: "", details: "" }, //It then adds a new object at the end of the array, representing a default menu item with empty values
      ],
    });
  };

  const removeMenuItem = (index) => {
    const menuItems = [...formData.menu]; // Creates a copy of the current menu items array using the spread operator.
    menuItems.splice(index, 1); // Removes the menu item at the specified index from the copied array.
    setFormData({ ...formData, menu: menuItems }); // Sets the state with the updated menu items array using setFormData.
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      //Create a FormData object
      const form = new FormData();

      //Handle restaurant image
      form.append("restaurantImage", formData.restaurantImage);

      form.append("name", formData.name || "");
      form.append("location", formData.location || "");
      form.append("rating", formData.rating || "");
      form.append("stars", formData.stars || "");

      // Loop through the menu and append menu items
      formData.menu.forEach((menuItem, index) => {
        form.append(`menu[${index}][name]`, menuItem.name);
        form.append(`menu[${index}][price]`, menuItem.price);
        form.append(`menu[${index}][tags]`, menuItem.tags);
        form.append(`menu[${index}][details]`, menuItem.details);
        form.append(`menu[${index}][menuImage]`, menuItem.menuImage);
      });

      const createdRestaurant = await createRestaurant(form);
      console.log("Restaurant created successfully:", createdRestaurant);
    } catch (error) {
      console.error("Error creating restaurant:", error.message);
    }
    setFormData({
      name: "",
      location: "",
      rating: 0,
      menuImage: "",
      stars: 0,
      menu: [],
    });
  };

  return (
    <>
      <form
        className="form"
        onSubmit={handleFormSubmit}
        encType="multipart/form-data"
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "20px" }}>Add Restaurant</h2>
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
        <div className={classes.formContainer}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </label>
          <br />

          <label>
            Rating:
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
            />
          </label>
          <label>
            ImageUrl:
            <input
              name="restaurantImage"
              type="file"
              accept="image/*"
              onChange={handleInputChange} //the onChange event is triggered when user select files. //to do additional operations with the event object or prevent its default behavior we use arrow function
            />
          </label>
          <label>
            Stars:
            <input
              type="number"
              name="stars"
              value={formData.stars}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "20px", marginTop: "18px" }}>Add menu</h2>
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

        {formData.menu.map((menuItem, index) => (
          <div key={index} className={classes.formContainer}>
            <label>
              Food Name:
              <input
                type="text"
                name={`menu[${index}]name`}
                value={menuItem.name}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <br />
            <label>
              Price:
              <input
                type="number"
                name={`menu[${index}]price`}
                value={menuItem.price}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <br />
            <label>
              Tags:
              <input
                type="text"
                name={`menu[${index}]tags`}
                value={menuItem.tags}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <label>
              ImageUrl:
              <input
                type="file"
                name={`menu[${index}]menuImage`}
                accept="image/*"
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>

            <br />
            <label>
              Details:
              <textarea
                name={`menu[${index}]details`}
                value={menuItem.details}
                onChange={(e) => handleInputChange(e, index)}
              />
            </label>
            <br />
            <button type="button" onClick={() => removeMenuItem(index)}>
              Remove
            </button>
          </div>
        ))}

        <div className="button-container">
          <button
            type="button"
            onClick={addMenuItem}
            style={{
              marginTop: "18px",
              backgroundColor: "rgba(83,28,200,1)",
              color: "white",
            }}
          >
            Add Food Item
          </button>
        </div>
        <div className="button-container">
          <button
            type="submit"
            style={{ backgroundColor: "green", color: "white" }}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default RestaurantForm;
