const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    lowercase: true,
    required: true,
  },
});

const Category = mongoose.model("category", categorySchema);

exports.Category = Category;
exports.categorySchema = categorySchema;
