import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "cart";
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  const initCart = getCartFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);

  useEffect(() => {
    const totalPrice = sum(cartItems.map((item) => item.price));
    const totalCount = sum(cartItems.map((item) => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
    localStorage.setItem(
      //save local storage. This means the current state of the cart is preserved even if the user leaves the website or closes their browser.
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems]); //whenever we change card items eg changing item , this useeffect will be called

  function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY); //It checks if data associated with that key exists and, if it does, it parses the data from a JSON string to a JavaScript object.
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }
  //list of price or quantity
  const sum = (items) => {
    return items.reduce((prevValue, curValue) => prevValue + curValue, 0); //sum of all items price or count
  };

  const removeFromCart = (foodId) => {
    const filteredCartItems = cartItems.filter(
      (item) => item.food._id !== foodId
    );
    setCartItems(filteredCartItems);
  };

  const changeQuantity = (cartItem, newQuantity, newUnits) => {
    // Calculate the total price based on the new units' add-ins and the item's base price.
    const newTotalPrice = newUnits
      ? newUnits.reduce((total, unit) => {
          const addInsTotalPrice = unit.addIns
            ? unit.addIns.reduce((subTotal, addIn) => subTotal + addIn.price, 0)
            : 0;
          return total + (cartItem.food.price + addInsTotalPrice);
        }, 0) * newQuantity
      : cartItem.food.price * newQuantity;

    // Construct the updated cart item with the new quantity, units, and recalculated price.
    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: newTotalPrice,
      Customization: newUnits, // Update the units based on the new customizations passed in
    };

    // Update the cart items array with the modified item.
    setCartItems(
      cartItems.map((item) =>
        item.food._id === cartItem.food._id ? changedCartItem : item
      )
    );
  };

  //This function allows users to add food items to their cart
  const addToCart = (food) => {
    const cartItem = cartItems.find((item) => item.food._id === food._id);
    if (cartItem) {
      const updatedItem = {
        ...cartItem,
        quantity: cartItem.quantity + 1,
      };
      setCartItems(
        cartItems.map((item) =>
          item.food._id === food._id ? updatedItem : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          food,
          quantity: 1,
          price: food.price,
        },
      ]);
    }
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    const { items, totalPrice, totalCount } = EMPTY_CART;
    setCartItems(items);
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
