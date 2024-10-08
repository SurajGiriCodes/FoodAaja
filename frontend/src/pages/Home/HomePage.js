import React, { useEffect, useReducer, useState } from "react";
import { getAll, search } from "../../services/foodService";
import Thumbnails from "../../Component/Thumbnails/Thumbnails";
import { useParams } from "react-router-dom";
import Search from "../Search/Search";
import NotFound from "../../Component/NotFound/NotFound";
import { Input, Button, Modal } from "antd";
import { searchFoodItems } from "../../services/foodService";
import { Slider } from "antd";

const initialState = {
  restaurant: [],
  tags: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RESTAURANT_LOADED":
      return { ...state, restaurant: action.payload }; // the reducer creates a new state object by spreading the current state ({...state}) and updating the restaurant property with the data contained in action.payload.
    case "TAGS_LOADED":
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { restaurant } = state;
  const { searchTerm } = useParams();
  const [searchTerm1, setSearchTerm1] = useState("Pizza");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(350); // Assuming 500 is the upper limit of your price range
  const [searchResults, setSearchResults] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isAdditionalOptionsVisible, setIsAdditionalOptionsVisible] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadRestaurent = searchTerm ? search(searchTerm) : getAll();
    loadRestaurent.then((restaurant) =>
      dispatch({ type: "RESTAURANT_LOADED", payload: restaurant })
    );
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const results = await searchFoodItems(searchTerm1, minPrice, maxPrice);
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
    }
  };

  const toggleAdditionalOptions = () => {
    setIsAdditionalOptionsVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            flex: 1,
          }}
        >
          <Search toggleAdditionalOptions={toggleAdditionalOptions} />
          {restaurant.length === 0 && <NotFound linkText="Reset Search" />}
          <Thumbnails restaurant={restaurant} />
        </div>

        <div
          style={{
            width: "300px",
            padding: "20px",
            marginLeft: "20px",
            display: isVisible ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{ width: "100%", marginBottom: "16px", marginTop: "20px" }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "15px",
              }}
            >
              <span>Min: Rs {minPrice}</span>
              <span>Max: Rs {maxPrice}</span>
            </div>

            <Slider
              range
              style={{ width: "230px" }}
              value={[minPrice, maxPrice]}
              onChange={(value) => {
                setMinPrice(value[0]);
                setMaxPrice(value[1]);
              }}
              min={0}
              max={500}
              step={10}
            />
          </div>

          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Input
              style={{ flex: 1 }}
              placeholder="Search food items!!"
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              type="primary"
              onClick={handleSearch}
              style={{ marginLeft: "10px" }}
            >
              Search
            </Button>
          </div>
          <div style={{ marginTop: "20px", width: "100%" }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <h3>
                  {result.menuItem.name} - Rs {result.menuItem.price}
                </h3>
                <p>Restaurant: {result.restaurant.name}</p>
                <p>Location: {result.restaurant.location}</p>
                <p>Rating: {result.restaurant.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title="Budgets Filter"
        open={isAdditionalOptionsVisible}
        onCancel={toggleAdditionalOptions}
        footer={[
          <Button key="back" onClick={toggleAdditionalOptions}>
            Close
          </Button>,
        ]}
      >
        <div style={{ width: "100%", marginBottom: "16px", marginTop: "20px" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "15px",
            }}
          >
            <span>Min: Rs {minPrice}</span>
            <span>Max: Rs {maxPrice}</span>
          </div>

          <Slider
            range
            style={{ width: "467px" }}
            value={[minPrice, maxPrice]}
            onChange={(value) => {
              setMinPrice(value[0]);
              setMaxPrice(value[1]);
            }}
            min={0}
            max={500}
            step={10}
          />
        </div>

        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Input
            style={{ flex: 1 }}
            placeholder="Search food items!!"
            value={searchTerm1}
            onChange={(e) => setSearchTerm1(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginLeft: "10px", marginTop: "0px" }}
          >
            Search
          </Button>
        </div>
        <div style={{ marginTop: "20px", width: "100%" }}>
          {searchResults.map((result, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <h3>
                {result.menuItem.name} - Rs {result.menuItem.price}
              </h3>
              <p>Restaurant: {result.restaurant.name}</p>
              <p>Location: {result.restaurant.location}</p>
              <p>Rating: {result.restaurant.rating}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
