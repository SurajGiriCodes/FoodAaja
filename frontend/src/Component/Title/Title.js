import React from "react";

export default function Title({
  title,
  fontSize,
  margin,
  marginBottom,
  marginTop,
  marginLeft,
}) {
  return (
    <h1
      style={{
        fontSize,
        margin,
        marginBottom: "20px",
        marginTop: "20px",
        color: "#616161",
        marginLeft: marginLeft,
      }}
    >
      {title}
    </h1>
  );
}
