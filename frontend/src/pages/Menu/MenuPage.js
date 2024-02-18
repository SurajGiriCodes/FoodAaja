import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Combined imports
import { getByID } from "../../services/foodService";
import classes from "./menu.module.css";
import { useCart } from "../../hooks/useCart";

export default function MenuPage({ margin }) {
  const [resMenu, setResMenu] = useState({ menu: [] }); // Initialize resMenu with an empty menu array
  const [filteredMenu, setFilteredMenu] = useState([]); // This will hold the filtered menu items
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");

  const handleAddToCart = (food) => {
    addToCart(food);
    navigate("/cart");
  };

  useEffect(() => {
    getByID(restaurantId).then((data) => {
      setResMenu(data);
      setFilteredMenu(data.menu);

      const uniqueTags = [];
      data.menu.forEach((item) => {
        if (item.tags) {
          item.tags.forEach((tag) => {
            if (uniqueTags.indexOf(tag) === -1) {
              uniqueTags.push(tag);
            }
          });
        }
      });
      setTags(uniqueTags); // Set the unique tags into the state
    });
  }, [restaurantId]);

  useEffect(() => {
    let filtered = resMenu.menu;

    // Filter based on the search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Further filter based on the selected tag, unless it's "All"
    if (selectedTag !== "All") {
      filtered = filtered.filter(
        (food) => food.tags && food.tags.includes(selectedTag)
      );
    }

    setFilteredMenu(filtered);
  }, [searchTerm, selectedTag, resMenu.menu]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag); // Directly set the selected tag
  };

  return (
    <div>
      <section>
        <div className={classes.title}>
          <h1 className={classes.restrurent}>{resMenu.name}</h1>
          <h2 className={classes.menuTitle}>Menu</h2>
          <div className={classes.underline}></div>
        </div>
        <div className={classes.container} style={{ margin }}>
          <input
            type="text"
            placeholder="Search menu items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              setFilteredMenu(
                resMenu.menu.filter((food) =>
                  food.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
            }
          />
          <button
            onClick={() =>
              setFilteredMenu(
                resMenu.menu.filter((food) =>
                  food.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
            }
            className={classes.searchButton}
          >
            Search
          </button>
        </div>
        <div
          className={classes.Tagscontainer}
          style={{ justifyContent: "center" }}
        >
          <span
            style={selectedTag === "All" ? selectedTagStyle : tagStyle}
            onClick={() => handleTagClick("All")}
          >
            All
          </span>
          {tags.map((tag, index) => (
            <span
              key={index}
              style={selectedTag === tag ? selectedTagStyle : tagStyle}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className={classes["section-center"]}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((food) => (
              <article key={food.id} className={classes["menu-item"]}>
                <img
                  src={food.menuImageUrl}
                  alt={food.name}
                  className={classes.imgclass}
                />
                <div className={classes["items-info"]}>
                  <header>
                    <h4>{food.name}</h4>
                    <h4 className={classes.price}>RS {food.price}</h4>
                  </header>
                  <p className={classes["item-text"]}>{food.details}</p>
                  <button onClick={() => handleAddToCart(food)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className={classes["no-results"]}>No items found!!</div>
          )}
        </div>
      </section>
    </div>
  );
}

const tagStyle = {
  padding: "0.3rem 1rem",
  margin: "0.2rem",
  borderRadius: "10rem",
  cursor: "pointer",
  fontWeight: "600",
  backgroundColor: "#f0f0f0", // default background for unselected tags
  color: "black", // default text color
};

const selectedTagStyle = {
  ...tagStyle, // spread the default tag styles
  backgroundColor: "blue", // background for selected tags
  color: "white", // text color for selected tags
};
