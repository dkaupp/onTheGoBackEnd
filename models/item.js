const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const reviewsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 80,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  stock: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 255,
  },
  image: {
    url: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  reviews: [reviewsSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("item", itemSchema);

exports.itemSchema = itemSchema;
exports.Item = Item;
