import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getByID } from "../../services/foodService";
import classes from "./menu.module.css";
import { useCart } from "../../hooks/useCart";

export default function MenuPage() {
  const [resmenu, setResMenu] = useState({});
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (food) => {
    addToCart(food);
    navigate("/cart");
  };

  useEffect(() => {
    getByID(restaurantId).then(setResMenu);
  }, [restaurantId]);

  return (
    <div>
      {resmenu && resmenu.menu && (
        <section>
          <div className={classes.title}>
            <h1 className={classes.restrurent}>{resmenu.name}</h1>
            <h2 className={classes.menuTitle}>Menu</h2>
            <div className={classes.underline}></div>
          </div>
          <div className={classes["section-center"]}>
            {resmenu.menu.map((food) => (
              <article key={food.id} className={classes["menu-item"]}>
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
