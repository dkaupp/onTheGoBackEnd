const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { Order } = require("../models/order");

const verifyCart = require("../middleware/cartToken");
const isAdmin = require("../middleware/isAdmin");

router.post("/", [auth, verifyCart], async (req, res) => {
  const cart = req.cart.items;
  const { paymentMethod, shipping } = req.body;

  if (cart.length === 0)
    return res.status(400).send({ error: "Cart is empty." });

  const customer = await Customer.findOne({ user: req.user._id }).populate(
    "shippingAddress"
  );
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  let order = new Order({
    customer: customer._id,
    cart: cart.cart,
    paymentMethod,
    shippingAddress: req.body.shippingAddress || customer.shippingAddress,
    subTotal: cart.totalAmount,
    shippingPrice: shipping,
    orderTotal: cart.totalAmount + shipping,
  });

  order = await order.save();

  res.status(200).send(order);
});

router.get("/", [auth, isAdmin], async (req, res) => {
  const orders = await Order.find();
  if (!orders)
    return res.status(400).send({ error: "No orders in the database." });

  return res.send(orders);
});

router.get("/customer/:id", auth, async (req, res) => {
  const orders = await Order.find({ customer: req.params.id });

  if (!orders) return res.status(400).send({ error: "Order was not found." });

  res.send(orders);
});

router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const order = await Order.findById(_id).populate(
    "customer",
    "name user email"
  );
  if (!order) return res.status(400).send({ error: "Order was not found." });

  res.send(order);
});

router.put("/:id/pay", [auth], async (req, res) => {
  let order = await Order.findById(req.params.id);

  if (!order) return res.status(400).send({ error: "Order not found." });

  const { paymentResult } = req.body;

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.payer.email_address,
  };

  order = await order.save();

  res.send(order);
});

router.put("/:id/delivered", [auth, isAdmin], async (req, res) => {
  let order = await Order.findById(req.params.id);

  if (!order) return res.status(400).send({ error: "Order not found." });

  order.deliveredAt = Date.now();
  order.delivery = "Delivered";
  order = await order.save();

  res.send(order);
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
  const { id } = req.params;

  console.log(id);
  const order = await Order.findByIdAndRemove(id);

  if (!order) return res.status(400).send({ error: "Order not found." });

  res.send(order);
});

module.exports = router;
