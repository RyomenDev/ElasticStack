import { Client } from "@elastic/elasticsearch";
import conf from "../conf/conf.js";

const connectDB = async () => {
  try {
    const esClient = new Client({ node: conf.DB_URL });
  } catch (error) {
    console.error("❌connection failed:", error.message);
    process.exit(1);
  }
};

export default esClient;
