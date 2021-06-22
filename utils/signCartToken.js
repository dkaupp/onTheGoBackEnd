const JWT = require("jsonwebtoken");

module.exports = (items) => {
  return JWT.sign(
    {
      items,
      iat: new Date().getTime(),
      exp: new Date().setSeconds(3600),
    },
    process.env.JWT_SECRET_CART
  );
};
