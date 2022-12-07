const express = require("express");
const router = express.Router();
const { checkToken } = require("./auth");
const Password = require("../model/password");

router.post("/", checkToken, async (req, res) => {
    const { userId } = req;
    const { hashs } = req.body;
    if (!hashs || !Array.isArray(hashs) || hashs.length <= 0) {
        return res.status(400).json("Missing hash");
    }

    const hashsWithUser = hashs.map((hash) => {
        return { hash, user: userId };
    });

    Password.insertMany(hashsWithUser)
        .then(function (hashs) {
            return res.status(200).json(hashs);
        })
        .catch(function (error) {
            return res.status(500).json("Server error");
        });
});

router.get("/", checkToken, async (req, res) => {
    const { userId } = req;

    const passwords = await Password.find({ user: userId }).exec();

    res.status(200).json(passwords);
});

module.exports = router;
