import express from "express";
import authenticateToken from "../authValidate.js";
import {
  getAllMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  getMedicationById,
} from "../controllers/medications.controllers.js";
import { validateMedication } from "../dataValidator.js";

const medicationsRouter = express.Router();

medicationsRouter.get(
  "/medications",
  authenticateToken,
  validateMedication,
  getAllMedications
);
medicationsRouter.get(
  "/medications/:id",
  authenticateToken,
  validateMedication,
  getMedicationById
);
medicationsRouter.post(
  "/medications/add",
  authenticateToken,
  validateMedication,
  addMedication
);
medicationsRouter.put(
  "/medications/:id",
  authenticateToken,
  validateMedication,
  updateMedication
);
medicationsRouter.delete(
  "/medications/:id",
  authenticateToken,
  deleteMedication
);

export default medicationsRouter;
