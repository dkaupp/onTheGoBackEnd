const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    cart: {
      type: Object,
      required: true,
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    delivery: {
      type: String,
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      updated_time: {
        type: String,
      },
      email_address: {
        type: String,
      },
    },
    orderTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);

exports.Order = Order;
