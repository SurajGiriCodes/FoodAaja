import React from "react";

export default function Title({
  title,
  fontSize,
  margin,
  marginBottom,
  marginTop,
}) {
  return (
    <h1 style={{ fontSize, margin, marginBottom, marginTop, color: "#616161" }}>
      {title}
    </h1>
  );
}
