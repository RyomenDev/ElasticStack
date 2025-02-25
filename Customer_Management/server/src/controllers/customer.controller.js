import fs from "fs";
import xlsx from "xlsx";
import esClient from "../db/elasticSearch.js";
import { sendNotification } from "../utils/socket.js";
import { Customer } from "../models/customer.model.js";
import { emitEvent } from "../utils/socket.js";

// Function to check if 'customers' index exists, and create if not
const ensureIndexExists = async () => {
  try {
    // const { body: exists } = await esClient.indices.exists({
    //   index: "customers",
    // });
    const exists = await esClient.indices.exists({ index: "customers" });

    if (exists) {
      //   console.log("✅ Elasticsearch index 'customers' already exists.");
      return; // Exit function if index exists
    }

    await esClient.indices.create({
      index: "customers",
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            contactInfo: { type: "text" },
            outstandingAmount: { type: "double" },
            paymentDueDate: { type: "date" },
            paymentStatus: { type: "keyword" },
          },
        },
      },
    });

    console.log("✅ Created 'customers' index successfully.");
  } catch (error) {
    if (
      error.meta &&
      error.meta.body &&
      error.meta.body.error.type === "resource_already_exists_exception"
    ) {
      console.warn("⚠️ Index already exists, skipping creation.");
    } else {
      console.error("❌ Error checking/creating index:", error.message);
    }
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  //   console.log("createCustomer", req.body);

  try {
    await ensureIndexExists(); // Ensure index exists before inserting data

    const { error } = Customer.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    } = req.body;

    console.log({
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    });

    const customer = {
      name,
      contactInfo,
      outstandingAmount,
      paymentDueDate,
      paymentStatus,
    };
    // console.log("Customer", customer);

    const response = await esClient.index({
      index: "customers",
      body: customer,
    });

    // console.log("response", response);
    sendNotification("New customer added", customer);

    res.status(201).json({ id: response._id, ...customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  //   console.log("Fetching customers...");

  try {
    await ensureIndexExists(); // Ensure index exists before searching

    const response = await esClient.search({
      index: "customers",
      size: 1000, // Retrieve up to 1000 customers
      query: { match_all: {} },
    });

    // console.log("Response", response);

    const customers = response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    // console.log(`Retrieved ${customers.length} customers.`, customers);
    res.json(customers); // Send customers as JSON response
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Payment Status Controller
export const updatePaymentStatus = async (req, res) => {
  //   console.log("updatePaymentStatus");

  const { customerId } = req.params;
  const { status } = req.body;

  //   console.log(
  //     `Updating payment status for customer ${customerId} to ${status}`
  //   );

  try {
    // Ensure the index exists before updating
    await ensureIndexExists();

    // Check if customer exists
    const customer = await esClient.get({
      index: "customers",
      id: customerId,
    });

    // console.log("Customer", customer);

    if (!customer.found) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Update customer payment status
    const response = await esClient.update({
      index: "customers",
      id: customerId,
      body: {
        doc: { paymentStatus: status },
      },
    });

    // Emit real-time update to frontend
    emitEvent("paymentUpdated", { customerId, status });

    // console.log("Payment status updated successfully:", response);
    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  console.log("updateCustomer", req.body);

  //   try {
  //     await ensureIndexExists(); // Ensure index exists before updating

  //     const { id } = req.params;
  //     const { error } = Customer.validate(req.body);
  //     if (error) return res.status(400).json({ error: error.details[0].message });

  //     const response = await esClient.update({
  //       index: "customers",
  //       id,
  //       body: { doc: req.body },
  //     });

  //     res.json({ id, updated: response.body.result === "updated" });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    await ensureIndexExists(); // Ensure index exists before deleting

    const { id } = req.params;
    await esClient.delete({ index: "customers", id });

    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Upload Customers via Excel
// export const bulkUpload = async (req, res) => {
//   console.log("bulkUpload-file", req.file);
//   console.log("bulkUpload-formData", req.formData);
//   console.log("bulkUpload", req.body);

//   try {
//     await ensureIndexExists(); // Ensure index exists before bulk upload

//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const filePath = req.file.path;
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     // Validate data before insertion
//     const validatedData = [];
//     for (const entry of data) {
//       const { error } = Customer.validate(entry);
//       if (!error) validatedData.push(entry);
//     }

//     if (validatedData.length === 0) {
//       fs.unlinkSync(filePath);
//       return res
//         .status(400)
//         .json({ message: "No valid records found in the file." });
//     }

//     const bulkOps = validatedData.flatMap((doc) => [
//       { index: { _index: "customers" } },
//       doc,
//     ]);
//     const { body } = await esClient.bulk({ refresh: true, body: bulkOps });

//     fs.unlinkSync(filePath); // Delete file after processing

//     sendNotification("Bulk customers uploaded", { count: body.items.length });
//     res.json({
//       message: "Bulk upload successful",
//       totalUploaded: body.items.length,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const bulkUpload = async (req, res) => {
    console.log("Hii");
    
  try {
    console.log("Received file:", req.file);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    console.log("Processing file:", filePath);

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log("Extracted Data:", data);

    if (!data.length) {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ message: "Empty file or no valid records." });
    }

    // Ensure Elasticsearch index exists
    await ensureIndexExists();

    // Validate and prepare data for Elasticsearch bulk upload
    const bulkOps = data.flatMap((entry) => [
      { index: { _index: "customers" } },
      entry,
    ]);

    console.log("Bulk Operations Prepared:", bulkOps.length);

    // Perform Elasticsearch bulk operation
    const { body } = await esClient.bulk({ refresh: true, body: bulkOps });
    console.log("Elasticsearch Response:", body);

    fs.unlinkSync(filePath); // Delete file after processing

    sendNotification("Bulk customers uploaded", { count: body.items.length });
    res.json({
      message: "Bulk upload successful",
      totalUploaded: body.items.length,
    });
  } catch (error) {
    console.error("Bulk upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
