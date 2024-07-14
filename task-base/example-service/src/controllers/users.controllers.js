import jwt from "jsonwebtoken";
import pool from "../db.js";
import bcrypt from "bcryptjs";

const generateAccessToken = (username) => {
  return jwt.sign({ data: username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

export const signIn = async (req, res, next) => {
  try {
    const client = await pool.connect();
    const { email, password } = req.body;

    const user = await client.query(`SELECT * FROM "User" WHERE email = $1`, [
      email,
    ]);
    client.release();

    if (!user.rows.length) {
      res.status(400).send({ message: "no such user" });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!passwordCorrect) {
      res.status(400).send({ message: "wrong password" });
    }

    const token = generateAccessToken(user.rows[0].email);
    res.status(200).send(token);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  try {
    const client = await pool.connect();
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.PASSWORD_SALT)
    );

    await pool.query(`INSERT INTO "User" (email, password) VALUES ($1, $2)`, [
      email,
      hashedPassword,
    ]);
    client.release();
    res.status(200).send(true);
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    if (req.user !== undefined) {
      res.status(200).send(true);
    } else {
      res.status(401).send(false);
    }
  } catch (error) {
    next(error);
  }
};
