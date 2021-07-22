const express = require("express");
const router = express.Router();
const { Item } = require("../models/item");
const shart = require("sharp");

const Joi = require("joi");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const validateObjectId = require("../middleware/validateObjectId");
const validateWith = require("../middleware/validation");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const { Category } = require("../models/category");
const imageResize = require("../middleware/imageResize");

const schema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  categoryId: Joi.objectId().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  description: Joi.string().min(10).max(255),
  isAvailable: Joi.boolean(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().min(5).max(200).required(),
});

router.get("/", async (req, res) => {
  const items = await Item.find();

  if (!items)
    return res
      .status(400)
      .send({ error: "There are no items in the data base." });

  res.status(200).send(items);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(400).send({ error: "Invalid Item id." });

  res.status(200).send(item);
});

router.post(
  "/",
  [auth, isAdmin, upload.single("image"), validateWith(schema), imageResize],
  async (req, res) => {
    const { name, categoryId, price, stock, description } = req.body;

    const categoryItem = await Category.findById(categoryId);

    if (!categoryItem)
      return res.status(404).send({ error: "Ivalid category" });

    let item = new Item({
      user: req.user._id,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: categoryItem,
      description,
      numReviews: 0,
    });

    const original = await cloudinary.uploader.upload(req.imageOriginal);
    const thumb = await cloudinary.uploader.upload(req.imageThumb);

    item.image = {
      url: original.secure_url,
      thumbnailUrl: thumb.secure_url,
    };

    item = await item.save();

    res.status(201).send(item);
  }
);

router.delete("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
  const item = await Item.findByIdAndRemove(req.params.id);

  if (!item) return res.status(400).send({ error: "Item not found." });

  res.status(200).send(item);
});

router.put(
  "/:id",
  [
    auth,
    isAdmin,
    upload.single("image"),
    validateWith(schema),
    validateObjectId,
    imageResize,
  ],
  async (req, res) => {
    let item = await Item.findById(req.params.id);

    if (!item)
      return res.status(400).send({ error: "The item was not found." });

    const { name, categoryId, price, stock, description } = req.body;

    const categoryItem = await Category.findById(categoryId);

    item.user = req.user._id;
    item.name = name;
    item.category = categoryItem;
    item.price = parseFloat(price);
    item.stock = parseInt(stock);
    item.description = description;

    console.log(item);

    const original = await cloudinary.uploader.upload(req.imageOriginal);
    const thumb = await cloudinary.uploader.upload(req.imageThumb);

    item.image = {
      url: original.secure_url,
      thumbnailUrl: thumb.secure_url,
    };

    item = await item.save();

    return res.status(200).send(item);
  }
);

router.put(
  "/:id/noimage",
  [auth, isAdmin, upload.none(), validateWith(schema), validateObjectId],
  async (req, res) => {
    let item = await Item.findById(req.params.id);

    if (!item)
      return res.status(400).send({ error: "The item was not found." });

    const { name, categoryId, price, stock, description } = req.body;

    const categoryItem = await Category.findById(categoryId);

    item.name = name;
    item.category = categoryItem;
    item.price = parseFloat(price);
    item.stock = parseInt(stock);
    item.description = description;

    item = await item.save();

    return res.status(200).send(item);
  }
);

router.post(
  "/:id/reviews",
  [auth, upload.none(), validateWith(reviewSchema), validateObjectId],
  async (req, res) => {
    let item = await Item.findById(req.params.id);

    if (!item)
      return res.status(400).send({ error: "The item was not found." });

    const { rating, comment } = req.body;

    const hasReviewed = item.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (hasReviewed)
      return res
        .status(400)
        .send({ error: "You reviewed the product already" });

    const review = {
      name: req.user.name,
      rating: parseInt(rating),
      user: req.user._id,
      comment,
    };

    console.log(review);

    item.reviews.push(review);
    item.numReviews = item.reviews.length;
    item.rating =
      item.reviews.reduce((a, b) => b.rating + a, 0) / item.reviews.length;

    item = await item.save();

    return res.status(200).send({ message: "Review Added" });
  }
);

module.exports = router;
