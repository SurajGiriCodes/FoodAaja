import axios from "axios";

export const getUser = () =>
  localStorage.getItem("user") //If there is a value associated with the key 'user' in localStorage, the .getItem('user') call will return that value.
    ? JSON.parse(localStorage.getItem("user")) //converting string to object
    : null;

export const login = async (email, password) => {
  const { data } = await axios.post("api/users/login", { email, password });
  localStorage.setItem("user", JSON.stringify(data)); // data received from the server converted to a JSON string
  return data; //data received from the server (which may include user information or a token) is returned from the login function  This JSON string is then stored in the browser's localStorage with the key 'user'.
};

export const logout = () => {
  localStorage.removeItem("user");
};
