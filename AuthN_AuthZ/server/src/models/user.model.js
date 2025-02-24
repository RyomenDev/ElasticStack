import esClient from "../db/elasticsearch.js";

const USER_INDEX = "users";

async function createUserIndex() {
  const exists = await esClient.indices.exists({ index: USER_INDEX });
  if (!exists) {
    await esClient.indices.create({
      index: USER_INDEX,
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            email: { type: "keyword" },
            password: { type: "text" },
          },
        },
      },
    });
    console.log("User index created");
  }
}

async function addUser(userData) {
  return await esClient.index({
    index: USER_INDEX,
    body: userData,
  });
}

async function findUserByEmail(email) {
  const { hits } = await esClient.search({
    index: USER_INDEX,
    body: {
      query: { term: { email: email } },
    },
  });

  return hits.hits.length > 0 ? hits.hits[0]._source : null;
}

export { createUserIndex, addUser, findUserByEmail };
