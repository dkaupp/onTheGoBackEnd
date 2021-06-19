require("dotenv").config();
const express = require("express");

const app = express();

require("./startup/parser")(app);
require("./startup/config")();
require("./startup/logging");
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
