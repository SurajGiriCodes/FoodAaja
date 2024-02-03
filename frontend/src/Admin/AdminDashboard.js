import React, { useState } from "react";
import { Menu } from "antd";
import { AppstoreOutlined, PieChartOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import RestaurantPage from "./Pages/RestaurantPage/RestaurantPage";
export default function AdminDashboard() {
  const { logout } = useAuth();
  const [selectedMenuItem, setSelectedMenuItem] = useState("restaurants");

  const handleMenuClick = (key) => {
    setSelectedMenuItem(key);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          height: "100%",
          transition: "width 0.3s",
          overflowY: "auto",
          width: 256,
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedMenuItem]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          style={{ height: "100%", borderRight: 0 }}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item
            key="admin"
            disabled
            style={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Admin Dashboard
          </Menu.Item>
          <Menu.Item
            key="restaurants"
            label="Restaurants"
            icon={<PieChartOutlined />}
          >
            <Link to="restaurants">Restaurant</Link>
          </Menu.Item>

          <Menu.Item key="orders" label="orders" icon={<PieChartOutlined />}>
            Orders
          </Menu.Item>

          <Menu.Item
            key="logout"
            icon={<AppstoreOutlined />}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </div>
      <div
        style={{ marginLeft: 256, padding: "20px", flex: 1, overflowY: "auto" }}
      >
        {selectedMenuItem === "restaurants" && <RestaurantPage />}
      </div>
    </div>
  );
}
