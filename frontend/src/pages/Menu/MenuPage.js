import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Combined imports
import { getByID } from "../../services/foodService";
import classes from "./menu.module.css";
import { useCart } from "../../hooks/useCart";

export default function MenuPage() {
  const [resMenu, setResMenu] = useState({ menu: [] }); // Initialize resMenu with an empty menu array
  const [filteredMenu, setFilteredMenu] = useState([]); // This will hold the filtered menu items
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = (food) => {
    addToCart(food);
    navigate("/cart");
  };

  useEffect(() => {
    // Fetch the restaurant's full menu
    getByID(restaurantId).then((data) => {
      setResMenu(data); // Assuming data has a 'menu' property
      setFilteredMenu(data.menu); // Initially, filteredMenu shows all items
    });
  }, [restaurantId]); // Dependency on restaurantId only

  useEffect(() => {
    // Filter the menu based on the search term
    if (searchTerm.trim()) {
      setFilteredMenu(
        resMenu.menu.filter((food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMenu(resMenu.menu);
    }
  }, [searchTerm, resMenu.menu]); // Dependencies on searchTerm and resMenu.menu

  return (
    <div>
      <input
        type="text"
        placeholder="Search menu items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchInput}
      />
      {filteredMenu.length > 0 && (
        <section>
          <div className={classes.title}>
            <h1 className={classes.restrurent}>{resMenu.name}</h1>
            <h2 className={classes.menuTitle}>Menu</h2>
            <div className={classes.underline}></div>
          </div>
          <div className={classes["section-center"]}>
            {filteredMenu.map((food) => (
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
