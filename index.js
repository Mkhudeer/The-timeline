const express = require("express");
const app = express();

const routes = require("./config/routes");

app.set('view engine','ejs');
app.use(routes);

app.listen(1200, () => {
  console.log("Server is running ");
});