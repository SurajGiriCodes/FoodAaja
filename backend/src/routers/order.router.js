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

// Payment initiation route
router.post(
  "/initiate-payment",
  auth,
  handler(async (req, res) => {
    const { amount, orderId, CustomerName } = req.body; // Ensure amount is in paisa and you have an orderId
    const returnUrl = `http://localhost:3000/track/${orderId}`;

    const data = {
      return_url: returnUrl,
      website_url: "http://localhost:3000/",
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
            Authorization: "Key 7950ac9f1ee64e04b4ebf01aefcb33a0",
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

// Example in your restaurant route file
router.get("/filtered", async (req, res) => {
  const { maxPrice } = req.query; // Assuming filtering based on maximum price
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

// In your orders routes file (e.g., routes/orders.js)
router.put("/update-delivery-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    // First, find the current order to check its status before updating
    const currentOrder = await OrderModel.findById(orderId);

    if (!currentOrder) {
      return res.status(404).send("Order not found");
    }

    // Check if the new delivery status is 'Delivered' and current order status is 'PENDING'
    // If so, update the status to 'PAID'
    const newStatus =
      deliveryStatus === "Delivered" &&
      currentOrder.status === OrderStatus.PENDING
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
