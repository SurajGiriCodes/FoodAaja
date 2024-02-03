import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByID } from "../../../services/foodService";
import classes from "../../../pages/Menu/menu.module.css";

export default function MenuPageA() {
  const [resmenu, setResMenu] = useState({});
  const { restaurantId } = useParams();

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
                  src={`${food.imageUrl}`}
                  alt={food.name}
                  className={classes.imgclass}
                />
                <div className={classes["items-info"]}>
                  <header>
                    <h4>{food.name}</h4>
                    <h4 className={classes.price}>RS {food.price}</h4>
                  </header>
                  <p className={classes["item-text"]}>{food.details}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
