const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { prisma } = require("../db");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.getUsers = async function (req, res) {
  const users = await prisma.user.findMany({ select: { name: true } });
  res.json(users);
};
exports.checkUser = asyncHandler(async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
    } else {
      const user = await prisma.user.findFirst({
        where: { name: authData.user },
        select: { name: true },
      });
      res.json({ message: "User is verified", user });
    }
  });
});
exports.createUser = asyncHandler(async (req, res) => {
  const name = req.body.name;
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    const user = await prisma.user.create({
      data: {
        name,
        password: hash,
      },
    });
    return res.status(201).json({ message: "User created", user });
  });
});
exports.loginUser = asyncHandler(async (req, res) => {
  const userExists = await prisma.user.findFirst({
    where: { name: req.body.name },
  });
  if (!userExists) {
    return res.status(400).json({ message: "User doesn't exists" });
  } else {
    const compare = bcrypt.compare(req.body.password, userExists.password);
    if (!compare) {
      return res.status(400).json({ message: "Wrong password" });
    } else {
      jwt.sign(
        { user: userExists.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json({ message: "Logged in", token: token });
        }
      );
    }
  }
});
