const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateObjectId");

const { Customer } = require("../models/customer");

const customerSchema = Joi.object({
  _id: Joi.objectId(),
  name: Joi.string().min(1).max(50).required(),
  phone: Joi.string().min(5).max(50).required(),
});

const addressSchema = Joi.object({
  _id: Joi.objectId(),
  street: Joi.string().min(5).max(255).required(),
  location: Joi.string().min(5).max(255).required(),
  number: Joi.number().min(0).required(),
});

router.post("/", [auth, validateWith(customerSchema)], async (req, res) => {
  const userId = req.user._id;
  const { name, phone } = req.body;

  console.log(userId);

  const customerFields = {};

  customerFields.name = name;
  customerFields.phone = phone;
  customerFields.user = userId;
  customerFields.address = [];

  const customer = await Customer.findOne({ user: userId });

  if (customer) {
    let updatedCustomer = await Customer.findOneAndUpdate(
      { user: userId },
      { $set: customerFields },
      { new: true }
    );

    return res.send(updatedCustomer);
  }

  let newCustomer = new Customer({ ...customerFields });
  newCustomer = await newCustomer.save();

  res.send(newCustomer);
});

router.post(
  "/address",
  [auth, validateWith(addressSchema)],
  async (req, res) => {
    const { street, location, number } = req.body;
    const newAddress = {
      street,
      location,
      number,
    };

    let customer = await Customer.findOne({ user: req.user._id });
    if (!customer) return res.status(400).send({ error: "User not found." });

    console.log(customer.address);

    customer.address = [...customer.address, newAddress];
    customer = await customer.save();

    res.send(customer);
  }
);

router.delete("/address/:id", [auth, validateId], async (req, res) => {
  const user = req.user._id;
  const addressId = req.params.id;

  let customer = await Customer.findOne({ user });
  if (!customer) return res.status(400).send({ error: "User not found." });

  console.log(addressId);
  customer.address = [
    ...customer.address.filter((a) => a._id.toString() !== addressId),
  ];

  customer = await customer.save();
  res.status(200).send(customer);
});

router.get("/", auth, async (req, res) => {
  const customer = await Customer.findOne({ user: req.user._id });
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  res.status(200).send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  res.status(200).send(customer);
});

module.exports = router;
