const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const outputFolder = "./uploads";

module.exports = async (req, res, next) => {
  const {file} = req;

    await sharp(file.path)
      .resize(2000)
      .jpeg({ quality: 50 })
      .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

    await sharp(file.path)
      .resize(100)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"));

    fs.unlinkSync(file.path);

  req.imageOriginal = file.path +  "_full.jpg";
  req.imageThumb = file.path + "_thumb.jpg"

  next();
};