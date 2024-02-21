import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import classes from "./header.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Layout, Menu } from "antd";
const { Header: AntHeader } = Layout;

function AdminHeader() {
  const { user, logout } = useAuth();
  return (
    <AntHeader
      style={{
        background: "white",
        padding: "0",
        width: "100%",
        borderBottom: "1px solid #e8e8e8",
        fontFamily: "Quicksand, sans-serif",
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
          <h2 style={{ fontSize: "18px" }}>FOODAAJA</h2>
        </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            fontFamily: "Quicksand, sans-serif",
            fontSize: "15px",
          }}
        >
          <Menu.Item key="1">
            <Link to="/restaurants">Restaurants</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/OrdersAdmin">Orders</Link>
          </Menu.Item>
          <Menu.Item key="3 ">
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

  const isAdmin = user && user.isAdmin;

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
                      <a onClick={logout}>Logout</a>
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
