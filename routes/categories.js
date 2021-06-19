const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  _id: Joi.objectId(),
});

router.get("/", validateWith(schema), async (req, res) => {
  const categories = await Caregory.find();
  if (!categories) {
    return res.status(400).send("There are no categories in the database.");
  }

  res.status(200).send(categories);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const _id = req.body._id || undefined;

  const category = await Category.findById(_id);
  if (category) {
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id },
      { $set: { name } },
      { new: true }
    );

    return res.send(updatedCategory);
  }

  const newCategory = new Category({ name });
  await newCategory.save();

  res.send(newCategory);
});

module.exports = router;
