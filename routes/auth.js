const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function checkLoginInput(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Email or password not provided");
    }

    req.email = email;
    req.password = password;

    next();
}

function checkToken(req, res, next) {
    const token = req.get("token");
    if (!token) {
        return res.status(400).json("Token not provided");
    }

    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json("Invalid token");
        }

        req.userId = decoded.id;
        req.token = token;

        next();
    } catch (err) {
        return res.status(400).json("Invalid token");
    }
}

router.post("/register", checkLoginInput, async (req, res) => {
    const { email, password } = req;
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(400).json("User already exists");
    }

    const newUser = new User({
        email,
        password: bcrypt.hashSync(password, 10),
    });

    await newUser.save();

    res.status(200).json("Created with success");
});

router.post("/login", checkLoginInput, async (req, res) => {
    const { email, password } = req;
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser) {
        return res.status(400).json("User do not exists");
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
        return res.status(400).json("Wrong password");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
});

module.exports = { auth: router, checkToken };
