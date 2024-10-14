import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import itemRoutess from "./routes/ItemRoutes.js";
import supplierRoutes from "./routes/SupplierRoute.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Mongo DB successfully!!!");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo");
  });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/item", itemRoutess);
app.use("/api/supplier", supplierRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000!!!");
});
