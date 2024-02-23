import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Combined imports
import { getByID } from "../../services/foodService";
import classes from "./menu.module.css";
import { useCart } from "../../hooks/useCart";
import { Modal, Button } from "antd";
import getWeather from "../../services/WeatherService";

export default function MenuPage({ margin }) {
  const [resMenu, setResMenu] = useState({ menu: [] }); // Initialize resMenu with an empty menu array
  const [filteredMenu, setFilteredMenu] = useState([]); // This will hold the filtered menu items
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBudgetRanges, setSelectedBudgetRanges] = useState({
    "100-200": false,
    "200-300": false,
    "300-400": false,
    "400-500": false,
    "500-600": false,
  });
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date()); // Stores the current time
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weather = await getWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentWeather(weather);
        } catch (error) {
          console.error("Failed to fetch weather:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours(); // Get the current hour in 24-hour format
    if (hour < 10) return "breakfast"; // Before 10 AM
    if (hour < 12) return "lunch"; // Between 10 AM and 12 PM
    if (hour < 18) return "snacks"; // Between 12 PM and 6 PM
    return "dinner"; // After 6 PM
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer); // Clean up on component unmount
  }, []);

  const mapWeatherToCondition = (weatherData) => {
    const temp = weatherData.main.temp; // Temperature
    const condition = weatherData.weather[0].main; // General weather condition (Rain, Clouds, Clear, etc.)

    // Map temperature to 'hot' or 'cold'
    if (temp <= 10) {
      return "hearty"; // Suggesting 'hearty' foods for cold temperatures
    } else if (temp >= 25) {
      return "refreshing"; // Suggesting 'refreshing' foods for hot temperatures
    }

    // Map specific weather conditions to categories
    switch (condition) {
      case "Rain":
      case "Drizzle":
      case "Thunderstorm":
        return "comfort"; // Comfort foods for rainy conditions
      case "Clouds":
        return "bright-flavorful"; // Bright and flavorful options for overcast days
      case "Clear":
        return "classics"; // Classics for clear weather
      case "Snow":
        return "hearty"; // Hearty foods for snowy conditions
      case "Wind":
      case "Dust":
      case "Fog":
        return "easy-to-eat"; // Easy-to-eat foods for windy or poor visibility conditions
      default:
        return "classics"; // Default category
    }
  };

  const updateRecommendations = () => {
    const timeOfDay = getTimeOfDay();
    console.log("Time of Day:", getTimeOfDay());
    console.log("Weather Condition:", mapWeatherToCondition(currentWeather));

    const weatherCondition = mapWeatherToCondition(currentWeather); // Implement based on your criteria, such as temperature and weather type
    const newRecommendations = resMenu.menu.filter((item) => {
      const matchesTime = item.tags.includes(timeOfDay);
      const matchesWeather = item.category === weatherCondition;
      return matchesTime && matchesWeather;
    });

    console.log(
      "Recommended items based on current weather and time:",
      newRecommendations
    ); // Log the recommended items
    setRecommendedItems(newRecommendations);
  };

  useEffect(() => {
    if (resMenu.menu && currentWeather) {
      updateRecommendations();
    }
  }, [resMenu.menu, currentWeather, currentTime]);

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

  const handleBudgetRangeChange = (selectedRange) => {
    setSelectedBudgetRanges((prevRanges) => ({
      ...prevRanges, // Keep the existing state of all ranges
      [selectedRange]: !prevRanges[selectedRange], // Toggle the state of the selected range
    }));
  };

  useEffect(() => {
    let filtered = resMenu.menu.filter((food) => {
      // Existing filters based on searchTerm and selectedTag
      const matchesSearchAndTag = searchTerm.trim()
        ? food.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesTag =
        selectedTag !== "All"
          ? food.tags && food.tags.includes(selectedTag)
          : true;

      // New filter based on selected budget ranges
      const price = food.price; // Assuming food.price is a number
      const matchesBudgetRange = Object.entries(selectedBudgetRanges).some(
        ([range, isChecked]) => {
          if (!isChecked) return false;
          const [min, max] = range.split("-").map(Number);
          return price >= min && price <= max;
        }
      );

      return (
        matchesSearchAndTag &&
        matchesTag &&
        (matchesBudgetRange ||
          Object.values(selectedBudgetRanges).every((isChecked) => !isChecked))
      );
    });

    setFilteredMenu(filtered);
  }, [searchTerm, selectedTag, resMenu.menu, selectedBudgetRanges]); // Add selectedBudgetRanges to the dependency array

  return (
    <div className={classes.mainContainer}>
      <section className={classes.menuSection}>
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

      {/* Display Single Recommendation with Budget Range inside */}
      <div className={classes.recommendationContainer}>
        <h3>Recommended for You</h3>
        {recommendedItems.length > 0 ? (
          <div className={classes.singleRecommendation}>
            <article className={classes.menuItem}>
              <img
                src={recommendedItems[0].menuImageUrl}
                alt={recommendedItems[0].name}
                className={classes.imgClass}
              />
              <div className={classes.itemsInfo}>
                <header>
                  <h4>{recommendedItems[0].name}</h4>
                  <h4 className={classes.price}>
                    RS {recommendedItems[0].price}
                  </h4>
                </header>
                <p className={classes.itemText}>
                  {recommendedItems[0].details}
                </p>
                <button onClick={() => handleAddToCart(recommendedItems[0])}>
                  Add to cart
                </button>
              </div>
            </article>
          </div>
        ) : (
          <div>No recommendations available right now.</div>
        )}

        {/* Nested Budget Range inside Recommendation */}
        <aside className={classes.budgetFilterContainerInsideRecommendation}>
          <h4>Budget Range</h4> {/* Changed to h4 for semantic structuring */}
          {Object.keys(selectedBudgetRanges).map((range) => (
            <div key={range}>
              <input
                type="checkbox"
                id={`inside-${range}`} // Changed to avoid duplicate IDs
                checked={selectedBudgetRanges[range]}
                onChange={() => {
                  handleBudgetRangeChange(range);
                  setIsModalVisible(false);
                }}
              />
              <label htmlFor={`inside-${range}`}>{range}</label>
            </div>
          ))}
        </aside>
      </div>

      <Button
        className={classes.showFilterButton}
        onClick={() => setIsModalVisible(true)}
      >
        Show Budget Filter
      </Button>
      <Modal
        title="Budget Range"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Remove default buttons
      >
        {Object.keys(selectedBudgetRanges).map((range) => (
          <div key={range}>
            <input
              type="checkbox"
              id={range}
              checked={selectedBudgetRanges[range]}
              onChange={() => {
                handleBudgetRangeChange(range);
                setIsModalVisible(false); // Close modal when a range is selected
              }}
            />
            <label htmlFor={range}>{range}</label>
          </div>
        ))}
      </Modal>
    </div>
  );
}

const tagStyle = {
  padding: "0.3rem 1rem",
  margin: "0.2rem",
  borderRadius: "10rem",
  cursor: "pointer",
  fontWeight: "600",
  backgroundColor: "#f0f0f0",
  color: "black",
};

const selectedTagStyle = {
  ...tagStyle,
  backgroundColor: "blue",
  color: "white",
};
