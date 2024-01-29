import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import classes from "./header.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const isAdmin = user && user.isAdmin;

  if (isAdmin) {
    // Redirect admin user to the admin dashboard
    return <Navigate to="/admin" />;
  }

  console.log("Rendering Header"); // Log that the header is being rendered

  return (
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
  );
}
