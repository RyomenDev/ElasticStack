import { app } from "./src/app.js";
import conf from "./src/conf/conf.js";
const { esClient } = require("./config/elasticSearch");

// Start Server
const PORT = conf.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }

  // Ensure the Elasticsearch index exists
  try {
    const exists = await esClient.indices.exists({ index: "customers" });
    if (!exists) {
      await esClient.indices.create({ index: "customers" });
      console.log("Elasticsearch Index 'customers' created.");
    }
  } catch (error) {
    console.error("Error initializing Elasticsearch:", error);
  }
};

startServer();
