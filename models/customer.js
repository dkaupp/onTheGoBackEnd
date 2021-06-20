const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  address: {
    type: [
      {
        street: {
          type: String,
          minlength: 5,
          maxlength: 255,
          required: true,
        },
        number: {
          type: Number,
          min: 0,
          required: true,
        },
        location: {
          type: String,
          minlength: 5,
          maxlength: 255,
          required: true,
        },
      },
    ],
  },
});

const Customer = mongoose.model("customer", customerSchema);

exports.Customer = Customer;
