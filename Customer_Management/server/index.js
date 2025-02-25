import { app } from "./src/app.js";
import conf from "./src/conf/conf.js";
import esClient from "./src/db/elasticsearch.js";

// Start Server
const PORT = conf.PORT || 5000;

const ensureIndexExists = async () => {
  try {
    const exists = await esClient.indices.exists({ index: "customers" });

    if (exists) {
      //   console.log("✅ Elasticsearch index 'customers' already exists.");
      return; // Exit function if index exists
    }

    // If index doesn't exist, create it with mappings
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
    console.error("❌ Error initializing Elasticsearch:", error.message);
  }
};

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });

    await ensureIndexExists(); // Ensure index exists before processing requests
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
