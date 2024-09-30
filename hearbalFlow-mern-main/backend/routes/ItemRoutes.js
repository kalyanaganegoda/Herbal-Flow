import express from "express";
import {
  createNewItem,
  getAllItems,
  getItembyId,
  deleteItem,
  updateItem,
} from "../controllers/ItemController.js";
const router = express.Router();

router.post("/add", createNewItem);
router.get("/get", getAllItems);
router.get("/get/:id", getItembyId);
router.delete("/delete/:id", deleteItem);
router.put("/update/:id", updateItem);

export default router;
