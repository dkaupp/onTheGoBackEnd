const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
