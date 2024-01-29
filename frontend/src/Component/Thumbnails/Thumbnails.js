import React from "react";
import { Link } from "react-router-dom";

import StarRating from "../StarRating/StarRating";
import classes from "./thumbnails.module.css";
export default function Thumbnails({ restaurant }) {
  return (
    <ul className={classes.list}>
      {restaurant.map((restaurant) => (
        <li key={restaurant.id}>
          <Link to={`/menu/${restaurant.id}`}>
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
                <StarRating stars={restaurant.stars} />
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
  );
}
