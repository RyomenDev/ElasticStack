# 1️⃣ Create a .env File
Inside your project, create a .env file for security:
```ini
PORT=5000
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_elastic_password
```

# 2️⃣ Start the Server
Run the app using nodemon:
```sh
npm run dev
```
If everything is set up correctly, you should see:
```arduino
⚡ Server running on port 5000
```

# 3️⃣ Test API Endpoints
**Use Postman, cURL, or your browser to test APIs.**

### 1️⃣ Check Elasticsearch Status
```sh
curl -X GET http://localhost:5000/es-status
```

### 2️⃣ Create an Index
```sh
curl -X POST http://localhost:5000/create-index -H "Content-Type: application/json" -d '{"indexName": "myindex"}'
```

### 3️⃣ Insert a Document
```sh
curl -X POST http://localhost:5000/add-document -H "Content-Type: application/json" -d '{"indexName": "myindex", "docId": "1", "data": {"message": "Hello Elasticsearch"}}'
```

### 4️⃣ Search for Documents
```sh
curl -X GET "http://localhost:5000/search?indexName=myindex&query=Hello"
```