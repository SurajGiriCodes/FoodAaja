import { Router } from "express";
import handler from "express-async-handler";
import auth from "../middleware/auth.mid.js";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import axios from "axios";
import { UserModel } from "../models/user.model.js";
import { header } from "express-validator";
import { DeliveryStatus } from "../constants/deliveryStatus.js";

const router = Router();

router.use(auth);

router.post(
  "/create",
  handler(async (req, res) => {
    const order = req.body;
    if (order.items.length <= 0) res.status(BAD_REQUEST).send("Cart Is Empty!");

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(BAD_REQUEST).send();
  })
);

router.get(
  "/allOrders",
  handler(async (req, res) => {
    try {
      // Fetch all orders without requiring authentication
      const orders = await OrderModel.find({})
        .populate("user", "name email")
        .sort("-createdAt");
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

router.post(
  "/initiate-payment",
  auth,
  handler(async (req, res) => {
    const { amount, orderId, CustomerName } = req.body;
    const returnUrl = `https://foodaaja-react-js-er6a.onrender.com/track/${orderId}`;

    const data = {
      return_url: returnUrl,
      website_url: "https://foodaaja-react-js-er6a.onrender.com/",
      amount: amount,
      purchase_order_id: orderId,
      purchase_order_name: "Order Payment",
      customer_info: {
        name: CustomerName,
      },
    };

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_TEST_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      res.status(500).send("Payment initiation failed");
    }
  })
);

router.put(
  "/pay",
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send("Order Not Found!");
      return;
    }
    order.paymentId = paymentId;
    order.status = OrderStatus.PAID;
    await order.save();
    res.send(order._id);
  })
);

router.put(
  "/cashOnDelivery",
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send("Order Not Found!");
      return;
    }
    order.status = OrderStatus.PENDING;
    await order.save();
    res.send(order._id);
  })
);

router.get(
  "/track/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);
    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    return res.send(order);
  })
);

router.get("/allstatus", (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

router.get(
  "/:status?",
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) filter.user = user._id;
    if (status) filter.status = status;

    //-createdAt it will show last order first
    const orders = await OrderModel.find(filter).sort("-createdAt");
    res.send(orders);
  })
);

router.get("/filtered", async (req, res) => {
  const { maxPrice } = req.query;
  const restaurants = await RestaurantModel.find({})
    .populate({
      path: "menu",
      match: { price: { $lte: maxPrice } },
    })
    .exec();

  // Filter out restaurants with no menu items within the price range
  const filteredRestaurants = restaurants.filter(
    (restaurant) => restaurant.menu.length > 0
  );
  res.json(filteredRestaurants);
});

router.get(
  "/orders",
  auth,
  handler(async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user.isAdmin) {
        return res.status(UNAUTHORIZED).send("Not authorized");
      }

      const orders = await OrderModel.find({})
        .populate("user", "name email")
        .sort("-createdAt");
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

router.get(
  "/delivered-orders/:userId",
  handler(async (req, res) => {
    try {
      const userId = req.params.userId;
      const deliveredOrders = await OrderModel.find({
        user: userId,
        deliveryStatus: "Delivered",
        "items.rating": null,
      })
        .sort({ createdAt: -1 })
        .populate("items.food", "name price menuImageUrl");

      if (!deliveredOrders || deliveredOrders.length === 0) {
        return res.json([]);
      }

      res.json(deliveredOrders);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      res.status(500).send("Internal Server Error");
    }
  })
);

router.put("/submit-rating", async (req, res) => {
  try {
    const { ratings } = req.body;

    const updatedOrderItems = [];

    for (const ratingData of ratings) {
      const { orderId, foodItemId, rating } = ratingData;

      const updatedOrderItem = await OrderModel.findOneAndUpdate(
        {
          _id: orderId,
          "items.food._id": foodItemId,
        },
        {
          $set: { "items.$.rating": rating },
        },
        { new: true }
      );

      if (!updatedOrderItem) {
        return res.status(404).json({
          error: `Order item not found for orderId: ${orderId} and foodItemId: ${foodItemId}`,
        });
      }
      updatedOrderItems.push(updatedOrderItem);
    }
    res.json({ message: "Ratings updated successfully", updatedOrderItems });
  } catch (error) {
    console.error("Failed to update ratings:", error);
    res.status(500).json({ error: "Failed to update ratings" });
  }
});

// Update the delivery status of an order
router.post(
  "/orders/:orderId/delivery-status",
  auth,
  header(async (req, res) => {
    try {
      const { deliveryStatus } = req.body;
      const order = await OrderModel.findByIdAndUpdate(
        req.params.orderId,
        { deliveryStatus },
        { new: true }
      );
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({
        message: "Error updating delivery status",
        error: error.message,
      });
    }
  })
);

router.get("/config/delivery-statuses", (req, res) => {
  res.json(DeliveryStatus);
});

router.put("/update-delivery-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const currentOrder = await OrderModel.findById(orderId);

    if (!currentOrder) {
      return res.status(404).send("Order not found");
    }

    // Check if the new delivery status is 'Delivered' and current order status is 'PENDING'
    // If so, update the status to 'PAID'
    const newStatus =
      (deliveryStatus === "Delivered" &&
        currentOrder.status === OrderStatus.PENDING) ||
      currentOrder.status === OrderStatus.NEW
        ? OrderStatus.PAID
        : currentOrder.status;

    // Update the order in your database with the new delivery status and possibly updated order status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { deliveryStatus, status: newStatus },
      { new: true } // This option returns the document after updates are applied
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update delivery status:", error);
    res.status(500).send("Internal Server Error");
  }
});

const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate("user");

export default router;
