import { useState, createContext, useContext } from "react";
import * as userService from "../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userService.getUser()); // retrieves the user's data from local storage or sets it to null if the user is not authenticated.

  const isAdmin = user && user.isAdmin;

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password); //This function presumably sends a request to a server for user authentication.
      setUser(user);
      toast.success("Login Successful");
      if (user.isAdmin) {
        navigate("/restaurants");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || "An error occurred during login");
    }
  };

  const register = async (data) => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success("Register Sucessful");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    localStorage.removeItem("accessToken");
    navigate("/login"); // Redirect to login after logout
    toast.success("Logout Successful");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
