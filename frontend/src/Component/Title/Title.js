import React from "react";

export default function Title({ title, fontSize, margin, marginBottom }) {
  return (
    <h1 style={{ fontSize, margin, marginBottom, color: "#616161" }}>
      {title}
    </h1>
  );
}
