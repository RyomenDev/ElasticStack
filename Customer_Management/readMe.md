**Start the Node.js backend:**

```sh
node server.js
```

✅ Features Implemented
✔️ Customer CRUD operations using ElasticSearch
✔️ Real-time WebSocket notifications
✔️ Bulk customer upload via Excel
✔️ Search & Sorting using ElasticSearch
✔️ No MongoDB – uses ElasticSearch only

#

#### Once you've created the Dockerfile and docker-compose.yml, follow these steps:

### 1️⃣ Build and start the containers

```sh
docker-compose up --build -d
```

### 2️⃣ Check running containers

```sh
docker ps
```

### 3️⃣ Stop and remove containers

```sh
docker-compose down
```

✅ What This Setup Does
✔ ElasticSearch runs as a separate container
✔ Node.js Backend runs in a container and connects to ElasticSearch
✔ Uses volumes to persist ElasticSearch data
✔ Automatically starts all services together
