const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./models/user-model");
const redis = require("redis");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/ShreeCaching").then(() => {
  console.log("Database connected...");
});

const client = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("connect", () => {
  console.log("Connected to redis");
});

client.connect();

app.post("/create", async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await userModel.create({ name, email });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    let data = await client.get(`user:profile:${req.params.id}`);

    if (data) {
      console.log("Chached se data Gya!!");
      // return res.send(JSON.parse(data));
      return res.send("Chached se data gya");
    }

    console.log("DB se data Gya!!");
    const user = await userModel.findOne({ _id: req.params.id });

    // await client.del(`user:profile:${req.params.id}`)

    await client.setEx(
      `user:profile:${req.params.id}`,
      5,
      JSON.stringify(user)
    );

    // await client.set(`user:profile:${user._id}`, JSON.stringify(user)) setting user data to RAM

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(3000);
