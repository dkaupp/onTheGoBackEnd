const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const validateObjectId = require("../middleware/validateObjectId");
const isAdmin = require("../middleware/isAdmin");

const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  _id: Joi.objectId(),
});

router.get("/", async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    return res
      .status(400)
      .send({ error: "There are no categories in the database." });
  }

  res.status(200).send(categories);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(400).send({ error: "Invalid category." });

  return res.status(200).send(category);
});

router.post("/", [validateWith(schema), auth, isAdmin], async (req, res) => {
  const { name } = req.body;
  const _id = req.body._id || undefined;

  const category = await Category.findById(_id);
  if (category) {
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id },
      { $set: { name, date: Date.now() } },
      { new: true }
    );

    return res.send(updatedCategory);
  }

  const newCategory = new Category({ name });
  await newCategory.save();

  res.send(newCategory);
});

router.delete("/:id", [validateObjectId, auth, isAdmin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category) return res.status(400).send({ error: "Category not found." });

  res.status(200).send(category);
});

module.exports = router;
