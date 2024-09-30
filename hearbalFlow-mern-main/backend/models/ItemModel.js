import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
  },
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
  },
  mfd: {
    type: String,
    required: true,
  },
  exp: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  quantity: {
    type: String,
  },
  description: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  suplier: {
    supId: {
      type: String,
    },
    supName: {
      type: String,
    },
    supEmail: {
      type: String,
    },
    supNIC: {
      type: String,
    },
    supPhone: {
      type: String,
    },
  },
});

const Items = mongoose.model("Item", itemSchema);

export default Items;
