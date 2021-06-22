const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  cart: {
    type: Object,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  shipAddress: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  delivery: {
    type: String,
    default: "Pending",
  },
});

const Order = mongoose.model("order", orderSchema);

exports.Order = Order;
