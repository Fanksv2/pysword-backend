const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes/routes");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/", routes);

const mongoose = require("mongoose");
const mongoDB = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.utsottw.mongodb.net/pysword?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(process.env.PORT || 5000, function () {
    console.log("Running on: " + (process.env.PORT || 5000));
});
