const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const { Customer } = require("../models/customer");
const { Order } = require("../models/order");

const verifyCart = require("../middleware/cartToken");

router.post("/", [auth, verifyCart], async (req, res) => {
  const cart = req.cart.items;
  const { paymentMethod } = req.body;

  if (cart.length === 0)
    return res.status(400).send({ error: "Cart is empty." });

  const customer = await Customer.findOne({ user: req.user._id }).populate(
    "shippingAddress"
  );
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  console.log(customer.shippingAddress[0]);

  let order = new Order({
    customer: customer._id,
    cart: cart.cart,
    paymentMethod,
    shippingAddress: req.body.shippingAddress || customer.shippingAddress[0],
    orderTotal: cart.totalAmount,
  });

  order = await order.save();

  res.status(200).send(order);
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

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.params.id,
    status: req.body.status,
    updated_time: req.body.updated_time,
    email_address: req.body.payer.email_address,
  };

  order = await order.save();

  res.send(order);
});

module.exports = router;
