import jwt from "jsonwebtoken";
import pool from "./db.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  await jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);

    const client = await pool.connect();

    const userData = await client.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [user.data]
    );
    client.release();

    req.user = userData.rows[0];

    next();
  });
};

export default authenticateToken;
