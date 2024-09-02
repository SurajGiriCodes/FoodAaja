import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./search.module.css";
import smallFoodImage from "../../images/momo.png";

Search.defaultProps = {
  searchRoute: "/search/",
  defaultRoute: "/",
  placeholder: "Search Restaurent",
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
  toggleAdditionalOptions,
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams();
  const [isVisible, setIsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); // Update window width on resize
      setIsVisible(window.innerWidth > 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  const search = async () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };
  return (
    <div className={classes.container} style={{ margin }}>
      <div
        style={{ display: "flex", alignItems: "center" }}
        className={classes.maincontainer}
      >
        <div className={classes.Searchcontainer}>
          <input
            type="text"
            placeholder={placeholder}
            onChange={(e) => setTerm(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && search()}
            value={term}
            style={{ marginTop: "50px" }}
          />
          <button onClick={search} style={{ marginTop: "50px" }}>
            Search
          </button>
        </div>
        <div className={classes.Buttoncontainer}>
          {!isVisible && (
            <button
              style={{
                marginTop: windowWidth < 700 ? "20px" : "50px",
                marginLeft: "10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px 10px",
                color: "#333",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                fontSize: windowWidth < 600 ? "0.8rem" : undefined,
                padding: windowWidth < 600 ? "3px 8px" : undefined,
              }}
              onClick={toggleAdditionalOptions}
            >
              Budgets Filter
            </button>
          )}
        </div>

        {isVisible && (
          <>
            <img
              src={smallFoodImage}
              alt="Small Image"
              style={{
                width: "125px",
                height: "149px",
                marginLeft: "91px",
                marginTop: "-46px",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
