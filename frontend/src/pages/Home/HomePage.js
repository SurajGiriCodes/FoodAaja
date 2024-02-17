import React, { useEffect, useReducer } from "react";
import { getAll, search } from "../../services/foodService";
import Thumbnails from "../../Component/Thumbnails/Thumbnails";
import { useParams } from "react-router-dom";
import Search from "../Search/Search";

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
  const { searchTerm } = useParams();

  useEffect(() => {
    const loadRestaurent = searchTerm ? search(searchTerm) : getAll();
    loadRestaurent.then((restaurant) =>
      dispatch({ type: "RESTAURANT_LOADED", payload: restaurant })
    );
  }, [searchTerm]);

  return (
    <>
      <Search />
      <Thumbnails restaurant={restaurant} />
    </>
  );
}
