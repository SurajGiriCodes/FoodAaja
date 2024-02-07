import { Router } from "express";
import handler from "express-async-handler";
import auth from "../middleware/auth.mid.js";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";

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

const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate("user");

router.post(
  "/initiate-payment",
  auth,
  handler(async (req, res) => {
    const { amount, orderId } = req.body; // Ensure amount is in paisa and you have an orderId
    const data = {
      return_url: "http://yourwebsite.com/payment-success",
      website_url: "http://yourwebsite.com",
      amount: amount,
      purchase_order_id: orderId,
      purchase_order_name: "Order Payment",
      // Add other fields as required by Khalti
    };

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data); // This should include the URL to redirect the user for payment
    } catch (error) {
      console.error("Payment initiation failed:", error);
      res.status(500).send("Payment initiation failed");
    }
  })
);

// Payment initiation route
router.post(
  "/initiate-payment",
  auth,
  handler(async (req, res) => {
    const { amount, orderId } = req.body; // Ensure amount is in paisa and you have an orderId
    const data = {
      return_url: "http://localhost:3000/",
      website_url: "http://localhost:3000/",
      amount: amount,
      purchase_order_id: orderId,
      purchase_order_name: "Order Payment",
      // Add other fields as required by Khalti
    };

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: `Key ${process.env.LIVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data); // This should include the URL to redirect the user for payment
    } catch (error) {
      console.error("Payment initiation failed:", error);
      res.status(500).send("Payment initiation failed");
    }
  })
);

export default router;
