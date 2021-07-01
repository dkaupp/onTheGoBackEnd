const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const itemSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("item", itemSchema);

exports.itemSchema = itemSchema;
exports.Item = Item;
