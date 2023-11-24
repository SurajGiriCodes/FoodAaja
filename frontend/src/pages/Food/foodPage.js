// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getFoodByID } from "../../services/foodService";
// import classes from "./foodPage.module.css";
// // import { sample_restaurants } from "../../data";

// export default function FoodPage() {
//   const [food, setFood] = useState({});
//   const { id } = useParams();

//   const getFoodByID = async (id) => {
//     console.log("Received id:", id);
//     const foodItem = sample_restaurants
//       .map((restaurant) => restaurant.menu)
//       .flat()
//       .find((menuItem) => menuItem.id === id);
//     console.log("Found food item:", foodItem);
//     if (foodItem) {
//       return foodItem;
//     } else {
//       throw new Error("food not found");
//     }
//   };

//   useEffect(() => {
//     getFoodByID(id).then(setFood);
//   }, [id]);

//   return (
//     <div>
//       {food && (
//         <div className={classes.container}>
//           <img
//             className={classes.image}
//             src={`/food/${food.imageUrl}`}
//             alt={food.name}
//           />
//           <h1>{food.name}</h1>
//           <h2>{food.price}</h2>
//         </div>
//       )}
//     </div>
//   );
// }
