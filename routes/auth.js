const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    //   GENERATE NEW ENCRYPTED PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE NEW USER
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      description: req.body.description,
      city: req.body.city,
      from: req.body.from,
    });

    // SAVE USER
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) res.status(404).json({ message: "User not found" });
    else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) res.status(400).json({ message: "Wrong password" });
      else res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error,
    });
  }
});

module.exports = router;
