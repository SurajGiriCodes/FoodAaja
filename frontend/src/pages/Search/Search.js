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
}) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? "");
  }, [searchTerm]);

  const search = async () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };
  return (
    <div className={classes.container} style={{ margin }}>
      <div style={{ display: "flex", alignItems: "center" }}>
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
        <img
          src={smallFoodImage} // Specify the path to your small image
          alt="Small Image"
          style={{
            width: "125px",
            height: "149px",
            marginLeft: "91px",
            marginTop: "-46px",
          }}
        />
      </div>
    </div>
  );
}
