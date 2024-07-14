import pool from "../db.js";

export const getAllMedications = async (req, res, next) => {
  try {
    const client = await pool.connect();

    const medications = await client.query(
      `SELECT * FROM "Medication" WHERE user_id = $1 ORDER BY creation_date DESC`,
      [req.user.id]
    );
    client.release();

    req.user = {};

    res.status(200).send(medications.rows);
  } catch (error) {
    next(error);
  }
};

export const getMedicationById = async (req, res, next) => {
  try {
    const client = await pool.connect();

    const medication = await client.query(
      `SELECT * FROM "Medication" WHERE user_id = $1 AND id = $2`,
      [req.user.id, req.params.id]
    );
    client.release();

    req.user = {};

    res.status(200).send(medication.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const addMedication = async (req, res, next) => {
  try {
    const client = await pool.connect();

    const { name, description, count, destination_count } = req.body.medication;

    await pool.query(
      `INSERT INTO "Medication" (name, description, count, destination_count, user_id) VALUES ($1, $2, $3, $4, $5)`,
      [name, description, count, destination_count, req.user.id]
    );
    client.release();

    req.user = {};
    res.status(200).send({ message: "Medication created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateMedication = async (req, res, next) => {
  try {
    const client = await pool.connect();
    const { name, description, count, destination_count } = req.body;
    const id = req.params.id;

    await client.query(
      `UPDATE "Medication" SET name = $1, description = $2, count = $3, destination_count = $4 WHERE id = $5`,
      [name, description, count, destination_count, id]
    );
    client.release();

    req.user = {};
    res.status(200).send({ message: "Medication updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteMedication = async (req, res, next) => {
  try {
    const client = await pool.connect();

    const id = req.params.id;

    await client.query(`DELETE FROM "Medication" WHERE id = $1`, [id]);
    client.release();

    req.user = {};
    res.status(200).send({ message: "Medication deleted successfully" });
  } catch (error) {
    next(error);
  }
};
