import Items from "../models/ItemModel.js";
import mongoose from "mongoose";

export const createNewItem = async (req, res) => {
  try {
    const newItem = new Items(req.body);
    await newItem.save();
    res.status(201).json({ message: "New Item added successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add a new Item",
      error: error.message,
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Items.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Items Data", error });
  }
};

export const getItembyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const item = await Items.findById(id);
      if (item) {
        return res.status(200).json(item);
      }
    }
    res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching Item: " + error.message });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await Items.findByIdAndDelete(id);
    res.status(200).json({ message: "Item Sucessfully Deleated" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleating Item" });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedItem = await Items.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Item Data", error });
  }
};
