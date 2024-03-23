import React from "react";
import AdminThumbnailsComponent from "./AdminThumbnailsComponent";
import Title from "../../Component/Title/Title";

function RestaurantPageAdmin() {
  return (
    <>
      <Title
        title="Restaurents"
        margin="1.5rem 0 0 2.5rem"
        marginLeft="40px"
        marginTop="87px"
      />
      <AdminThumbnailsComponent />
    </>
  );
}

export default RestaurantPageAdmin;
