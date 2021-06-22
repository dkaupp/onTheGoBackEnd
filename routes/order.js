const express = require("express");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");

const verifyCart = require("../middleware/cartToken");

const schema = Joi.object({
  _id: Joi.objectId(),
  customer: Joi.objectId(),
  cart: Joi.object().required(),
  paymentId: Joi.string().required(),
  shipAddress: Joi.objectId().required(),
});

router.post("/", verifyCart, async (req, res) => {
  res.send(req.cart);
});

module.exports = router;
