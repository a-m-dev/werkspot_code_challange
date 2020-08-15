import express from "express";
import path from "path";

// define app
const app = express();
const PORT = process.env.PORT || 3000;

// template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// assets and statics
app.use(express.static(__dirname));

// pages
app.get(/^\/(?:index)?(?:[#?]|$)/, (req, res, next) => {
  res.render("pages/index");
});

app.listen(PORT, () => {
  console.log(`App is Ready on Port ${PORT}`);
});
