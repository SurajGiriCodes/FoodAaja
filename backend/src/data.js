export const sample_restaurants = [
   
  {
    name: "Chinese Wok",
    location: "456 Elm St, City",
    rating: 4.4,
    imageUrl: "res_2.jpg",
    stars: 4.5,
    menu: [
      {
        name: "Meatball",
        price: 150,
        cookTime: "20-30",
        favorite: true,
        stars: 5,
        imageUrl: "food-2.jpg",
        tags: ["SlowFood", "Lunch"],
        details:
          "Meatballs are a popular and versatile food item made from ground meat, typically beef, pork, or a combination of meats.",
      },
      {
        name: "Hamburger",
        price: 130,
        cookTime: "10-15",
        favorite: false,
        stars: 3.5,
        imageUrl: "food-3.jpg",
        tags: ["FastFood", "Hamburger"],
        details:
          "Hamburger is a sandwich consisting of a ground meat patty (typically beef) served between two halves of a bun.",
      },
    ],
  },
  {
    name: "Fry House",
    location: "101 Pine St, City",
    rating: 4.0,
    imageUrl: "res_3.jpg",
    stars: 4.5,
    menu: [
      {
        name: "Fried Potatoes",
        price: 100,
        cookTime: "15-20",
        favorite: true,
        stars: 3,
        imageUrl: "food-4.jpg",
        tags: ["FastFood", "Fry"],
        details:
          "Fried potatoes, often referred to as French fries, are thin slices or sticks of potatoes that are deep-fried until crispy. Potatoes can also be fried in a pan.",
      },
      {
        name: "Chicken Soup",
        price: 200,
        cookTime: "40-50",
        favorite: false,
        stars: 3.5,
        imageUrl: "food-5.jpg",
        tags: ["SlowFood", "Soup"],
        details:
          "Chicken soup is a soothing and nourishing soup made by simmering chicken meat, often with vegetables, in a flavorful broth.",
      },
    ],
  },
];

export const sample_users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    password: "12345",
    address: "Toronto On",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Suraj Giri",
    email: "suraj@gmail.com",
    password: "12345",
    address: "Shanghai",
    isAdmin: true,
  },
];
