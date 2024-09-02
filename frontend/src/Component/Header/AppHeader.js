import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import classes from "./header.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Layout, Menu } from "antd";
import logo from "../../images/logo.png";
const { Header: AntHeader } = Layout;

function AdminHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  return (
    <AntHeader
      style={{
        background: "white",
        padding: "0",
        width: "100%",
        borderBottom: "1px solid #e8e8e8",
        fontFamily: "Quicksand, sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div className={classes.logo} style={{ float: "left" }}>
          <h2>
            <img src={logo} style={{ width: "100px", height: "auto" }} />
          </h2>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "15px",
          }}
        >
          <Menu.Item key="/restaurants">
            <Link to="/restaurants">Restaurants</Link>
          </Menu.Item>
          <Menu.Item key="/OrdersAdmin">
            <Link to="/OrdersAdmin">Orders</Link>
          </Menu.Item>
          <Menu.Item key="/OrderCheck">
            <Link to="/OrderCheck">Check Orders</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <a onClick={logout}>Logout</a>
          </Menu.Item>
        </Menu>
      </div>
    </AntHeader>
  );
}

export default function AppHeader() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { clearCart } = useCart();

  const isAdmin = user && user.isAdmin;

  const handleLogout = () => {
    clearCart();
    logout();
  };

  return (
    <Layout>
      {isAdmin ? (
        <AdminHeader />
      ) : (
        <header className={classes.header}>
          <div className={classes.container}>
            <Link to="/" className={classes.logo}>
              FoodAAJA
            </Link>
            <nav>
              <ul>
                {user ? (
                  <li className={classes.menu_container}>
                    <Link to="/profile">{user.name}</Link>
                    <div className={classes.menu}>
                      <Link to="/profile">Profile</Link>
                      <Link to="/orders">Orders</Link>
                      <a onClick={handleLogout}>Logout</a>
                    </div>
                  </li>
                ) : (
                  <Link to="/login">Login</Link>
                )}

                {!isAdmin && (
                  <li>
                    <Link to="/cart">
                      Cart
                      {cart.totalCount > 0 && (
                        <span className={classes.cart_count}>
                          {cart.totalCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      )}
    </Layout>
  );
}
