import React, { useEffect, useReducer } from "react";
import { getAll } from "../../services/foodService";
import Thumbnails from "../../Component/Thumbnails/Thumbnails";

const initialState = {
  restaurant: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RESTAURANT_LOADED":
      return { ...state, restaurant: action.payload }; // the reducer creates a new state object by spreading the current state ({...state}) and updating the restaurant property with the data contained in action.payload.
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { restaurant } = state;

  useEffect(() => {
    getAll().then((restaurant) =>
      dispatch({ type: "RESTAURANT_LOADED", payload: restaurant })
    );
  }, []);

  return <Thumbnails restaurant={restaurant} />;
}
