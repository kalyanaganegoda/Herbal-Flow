import express from 'express';
import validateSchema from '../Middleware/ValidateSchema.js';
import SupplierYup from '../Utils/SupplierYup.js'; 
import {createNewSupplier,getAllSuppliers,getSupplierbyId,deleteSupplier,updateSupplier} from '../controllers/SupplierController.js'

const router = express.Router();

// Route to handle adding a new Supplier
router.post('/addSupplier', validateSchema(SupplierYup.addSupplier), createNewSupplier);

// Route to handle getting an Supplier by ID
router.get('/getSupplier', validateSchema(SupplierYup.getSupplier), getSupplierbyId);

// Route to handle getting all Suppliers
router.get('/getAllSuppliers', getAllSuppliers);

// Route to handle deleting an Supplier by ID
router.delete('/deleteSupplier/:id', deleteSupplier);

// Route to handle updating an Supplier by ID
router.put('/updateSupplier/:id', validateSchema(SupplierYup.updateSupplier), updateSupplier);

export default router;
