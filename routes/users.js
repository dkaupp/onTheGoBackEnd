const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("joi");
const validateWith = require("../middleware/validation");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email().lowercase(),
  password: Joi.string().min(5).max(255).required(),
});

router.post("/", validateWith(schema), async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });

  if (user) return res.status(400).send({ error: "User already registered." });

  user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

router.put("/", [auth], async (req, res) => {
  const _id = req.user._id;
  let user = await User.findById(_id);

  if (!user) return res.status(400).send("User not found.");
  const { email, password, name } = req.body;

  user.email = email ? email : user.email;
  user.name = name ? name : user.name;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(token);
});

router.put("/:id", [auth, isAdmin], async (req, res) => {
  const { id } = req.params;
  const { email, name, isAdmin } = req.body;

  const user = await User.findById(id);

  if (!user) return res.status(400).send("User not found.");

  user.email = email ? email : user.email;
  user.name = name ? name : user.name;
  user.isAdmin = isAdmin ? isAdmin : user.isAdmin;

  user.save();

  res.send(_.pick(user, ["name", "email", "isAdmin"]));
});

router.get("/", [auth, isAdmin], async (req, res) => {
  const users = await User.find();

  if (!users)
    return res.status(400).send("There are no users in the database.");

  res.send(
    users.map((user) => _.pick(user, ["name", "email", "_id", "isAdmin"]))
  );
});

router.get("/:id", [auth, isAdmin], async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) return res.status(400).send("User not found.");

  res.send(_.pick(user, ["name", "email", "_id", "isAdmin"]));
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
  const deletedUser = await User.findByIdAndRemove(req.params.id);

  if (!deletedUser) return res.status(400).send("User not found.");

  res.send("success");
});

module.exports = router;
