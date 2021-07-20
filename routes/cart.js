const express = require("express");
const router = express.Router();
const cartToken = require("../middleware/cartToken");
const signCartToken = require("../utils/signCartToken");
const validateObjectId = require("../middleware/validateObjectId");
const { Cart } = require("../models/cart");
const { Item } = require("../models/item");

router.post("/", cartToken, async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send({ error: "Token not found." });

  res.status(200).send(token);
});

router.post("/:id", [validateObjectId, cartToken], async (req, res) => {
  const _id = req.params.id;
  const { qty } = req.body;
  const cart = new Cart(
    Object.keys(req.cart.items).length > 0 ? req.cart.items.cart : []
  );

  const item = await Item.findById(_id).select([
    "name",
    "category.name",
    "price",
    "stock",
    "image",
    "description",
  ]);
  if (!item) return res.status(400).send({ error: "Item not found." });
  if (item.stock === 0) return res.status(400).send({ error: "Out of stock." });

  cart.addItemCart(item, qty);
  const token = signCartToken(cart);
  res.status(200).send(token);
});

router.put("/:id", [validateObjectId, cartToken], async (req, res) => {
  const _id = req.params.id;
  const { qty } = req.body;
  const cart = new Cart(
    Object.keys(req.cart.items).length > 0 ? req.cart.items.cart : []
  );

  cart.removeItem(_id, "-", qty);
  const token = signCartToken(cart);

  res.status(200).send(token);
});

router.put("/delete/:id", [validateObjectId, cartToken], async (req, res) => {
  const _id = req.params.id;

  const cart = new Cart(
    Object.keys(req.cart.items).length > 0 ? req.cart.items.cart : []
  );

  cart.removeCartItem(_id);
  const token = signCartToken(cart);
  res.status(200).send(token);
});

router.delete("/", cartToken, async (req, res) => {
  const cart = new Cart([]);
  cart.clearCart();
  const token = signCartToken(cart);
  res.status(200).send(token);
});

module.exports = router;
