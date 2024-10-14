import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";

export const createNewSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json({ message: "New Supplier added successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add a new Supplier",
      error: error.message,
    });
  }
};

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching suppliers Data", error });
  }
};

export const getSupplierbyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const supplier = await Supplier.findById(id);
      if (supplier) {
        return res.status(200).json(supplier);
      }
    }
    res.status(404).json({ message: "Supplier not found" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error fetching Supplier: " + error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    await Supplier.findByIdAndDelete(id);
    res.status(200).json({ message: "Supplier Sucessfully Deleated" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleating Supplier" });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Supplier Data", error });
  }
};
