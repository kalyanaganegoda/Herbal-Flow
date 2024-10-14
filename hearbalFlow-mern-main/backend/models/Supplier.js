import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        website: {
            type: String,
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: { created_at: "created_at", updated_at: "updated_at" }
    }
)

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier