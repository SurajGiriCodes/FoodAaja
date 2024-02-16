import React from "react";

export default function Title({
  title,
  fontSize,
  margin,
  marginBottom,
  marginTop,
}) {
  return (
    <h1
      style={{
        fontSize,
        margin,
        marginBottom: "20px",
        marginTop: "20px",
        color: "#616161",
      }}
    >
      {title}
    </h1>
  );
}
