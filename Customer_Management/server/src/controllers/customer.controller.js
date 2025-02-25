const fs = require("fs");
const xlsx = require("xlsx");
const { esClient } = require("../config/elasticSearch");
const { sendNotification } = require("../utils/socket");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    } = req.body;
    const customer = {
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    };

    const response = await esClient.index({
      index: "customers",
      body: customer,
    });

    sendNotification("New customer added", customer);
    res.status(201).json({ id: response.body._id, ...customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const { body } = await esClient.search({
      index: "customers",
      size: 1000, // Fetch up to 1000 results
      query: { match_all: {} },
    });

    const customers = body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    } = req.body;

    const response = await esClient.update({
      index: "customers",
      id,
      body: {
        doc: {
          name,
          contactInfo,
          outstandingAmount,
          paymentDueDate,
          paymentStatus,
        },
      },
    });

    res.json({ id, updated: response.body.result === "updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await esClient.delete({ index: "customers", id });

    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Upload Customers via Excel
exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const bulkOps = data.flatMap((doc) => [
      { index: { _index: "customers" } },
      doc,
    ]);
    const { body } = await esClient.bulk({ refresh: true, body: bulkOps });

    fs.unlinkSync(filePath); // Delete file after processing

    sendNotification("Bulk customers uploaded", { count: body.items.length });
    res.json({
      message: "Bulk upload successful",
      totalUploaded: body.items.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
