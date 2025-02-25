const express = require("express");
const multer = require("multer");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  bulkUpload,
} = require("../controllers/customerController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", createCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/bulk-upload", upload.single("file"), bulkUpload);

module.exports = router;
