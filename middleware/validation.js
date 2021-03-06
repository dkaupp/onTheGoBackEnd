module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  next();
};
