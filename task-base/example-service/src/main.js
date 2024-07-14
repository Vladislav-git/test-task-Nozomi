import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import usersRouter from "./routes/users.routes.js";
import medicationsRouter from "./routes/medications.routes.js";

const expressApp = express();
const port = 8090;

const startServer = (app) => {
  app.use(cors());
  app.use(express.json());

  app.use(usersRouter);
  app.use(medicationsRouter);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
  });
};

startServer(expressApp);
