import express from "express";
import {
  signIn,
  signUp,
  validateToken,
} from "../controllers/users.controllers.js";
import authenticateToken from "../authValidate.js";
import { validateUser } from "../dataValidator.js";

const usersRouter = express.Router();

usersRouter.post("/signIn", validateUser, signIn);
usersRouter.post("/signUp", validateUser, signUp);
usersRouter.get("/validateToken", authenticateToken, validateToken);

export default usersRouter;
