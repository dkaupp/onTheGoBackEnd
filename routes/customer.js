const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { Customer } = require("../models/customer");
const { User } = require("../models/user");

const customerSchema = Joi.object({
  _id: Joi.objectId(),
  name: Joi.string().min(1).max(50).required(),
  address: Joi.string().min(5).max(255).required(),
  city: Joi.string().min(5).max(255).required(),
  postalCode: Joi.string().min(5).required(),
  country: Joi.string().required(),
});

router.post("/", [auth, validateWith(customerSchema)], async (req, res) => {
  const userId = req.user._id;
  const { name, phone, address, city, postalCode, country } = req.body;

  const customerFields = {};

  const user = await User.findById(userId);

  customerFields.name = name;
  customerFields.phone = phone;
  customerFields.user = userId;
  customerFields.email = user.email;
  customerFields.shippingAddress = {
    address,
    city,
    postalCode,
    country,
  };

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

router.get("/", auth, async (req, res) => {
  const customer = await Customer.findOne({ user: req.user._id });
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  res.status(200).send(customer);
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(400).send({ error: "Customer not found." });

  res.status(200).send(customer);
});

router.get("/allCustomers/", [auth, isAdmin], async (req, res) => {
  const customers = await Customer.find();
  if (!customers)
    return res
      .status(400)
      .send({ error: "There are no customers in the database." });

  res.status(200).send(customers);
});

module.exports = router;
