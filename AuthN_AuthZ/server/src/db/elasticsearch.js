import { Client } from "@elastic/elasticsearch";
import conf from "../conf/conf.js";

const esClient = new Client({
  node: conf.ELASTICSEARCH_URL,
  auth: conf.ELASTICSEARCH_USERNAME
    ? {
        username: conf.ELASTICSEARCH_USERNAME,
        password: conf.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
});

export default esClient;

// import { Client } from "@elastic/elasticsearch";
// const esClient = new Client({ node: "http://localhost:5601" });
// export default esClient;
