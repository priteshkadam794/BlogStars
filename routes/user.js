const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/users/login");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });

  res.redirect("/users/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token).redirect("/");
  } catch (e) {
    res.render("login", {
      error: e,
    });
  }
});

module.exports = router;
