const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8000;
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const Blog = require("./models/blog");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose
  .connect("mongodb://localhost:27017/blogstars")
  .then((e) => console.log("mongoDB connected"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(express.static("./public"));

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.get("/", async (req, res) => {
  const blogs = await Blog.find({});

  res.render("home", {
    user: req.user,
    blogs: blogs,
  });
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
