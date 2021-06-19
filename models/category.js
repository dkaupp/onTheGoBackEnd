const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    lowercase: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("category", categorySchema);

exports.Category = Category;
exports.categorySchema = categorySchema;
