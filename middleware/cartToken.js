const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let { token } = req.body;

  if (!token) {
    token = JWT.sign(
      {
        items: { cart: [] },
        iat: new Date().getTime(),
        exp: new Date().setSeconds(3600),
      },
      process.env.JWT_SECRET_CART
    );
    if (!req.params.id) {
      return res.status(200).send(token);
    }
  }

  if (typeof token !== "undefined") {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_CART);
    req.cart = decoded;
    next();
  } else {
    return res.status(400).send({ error: "Invalid cart token." });
  }
};
