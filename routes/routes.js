const express = require("express");
const router = express.Router();
const { auth } = require("./auth");
const password = require("./password");

router.use("/auth", auth);
router.use("/password", password);

module.exports = router;
