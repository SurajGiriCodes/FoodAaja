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
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems]); //when ever we change card items eg changing item , this useeffect will be called

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

  const changeQuantity = (
    cartItem,
    newQauntity,
    newCustomizationDetails = cartItem.customizationDetails,
    newAddIns = cartItem.addIns
  ) => {
    const { food } = cartItem;
    const addInsTotalPrice = newAddIns.reduce(
      (total, addIn) => total + addIn.price * addIn.quantity,
      0
    );
    const changedCartItem = {
      ...cartItem,
      quantity: newQauntity,
      price: (food.price + addInsTotalPrice) * newQauntity,
      customizationDetails: newCustomizationDetails,
      addIns: newAddIns,
    };

    setCartItems(
      cartItems.map((item) =>
        item.food._id === food._id ? changedCartItem : item
      )
    );
  };

  const addToCart = (food, customizationDetails = "", addIns = []) => {
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
      // If the item doesn't exist, add it as a new item along with its customization details
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
