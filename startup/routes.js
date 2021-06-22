const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");
const categories = require("../routes/categories");
const items = require("../routes/items");
const customer = require("../routes/customer");
const order = require("../routes/order");
const cart = require("../routes/cart");

module.exports = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/category", categories);
  app.use("/api/items", items);
  app.use("/api/customer", customer);
  app.use("/api/order", order);
  app.use("/api/cart", cart);
  app.use(error);
};
