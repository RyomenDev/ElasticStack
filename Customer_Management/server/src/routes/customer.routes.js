import express from "express";
import multer from "multer";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  bulkUpload,
} from "../controllers/customer.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", createCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/bulk-upload", upload.single("file"), bulkUpload);

// module.exports = router;
export default router;
