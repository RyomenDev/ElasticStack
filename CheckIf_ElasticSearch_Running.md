### 1️⃣ Install Elasticsearch

If you haven't installed Elasticsearch yet, download and install it:

🔗 Download Elasticsearch

```
https://www.elastic.co/downloads/elasticsearch
```

**Start Elasticsearch**
After installation, start Elasticsearch:

```sh
# Linux/macOS
./bin/elasticsearch
# Windows
bin\elasticsearch.bat
```

**Verify it’s running:**

```sh
curl -X GET http://localhost:9200
or open http://localhost:9200 in your browser.
```

**If it works, you should see a response like:**

```json
{
  "name": "your-machine",
  "cluster_name": "elasticsearch",
  "version": {
    "number": "8.x.x"
  }
}
```

## Issue: "Received plaintext HTTP traffic on an HTTPS channel"
**Received plaintext http traffic on an https channel, closing connection**

Your Elasticsearch is running in HTTPS mode, but your request is using HTTP instead of HTTPS. That’s why it’s rejecting the connection.

## 🔧 Solution: Use HTTPS instead of HTTP
Instead of:

```sh
curl -X GET http://localhost:9200
```
**Try:**

```sh
curl -X GET https://localhost:9200 -k --user elastic:<your-password>
```
**-k: Skips SSL certificate verification (use this only in development).
--user elastic:<your-password>: Use your Elasticsearch username and password.**

## 🔍 Option 1: Disable Security (Only for Local Development)
If you're testing locally and don't need security, disable HTTPS and authentication in elasticsearch.yml:

```yaml
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
```
Then restart Elasticsearch:

```sh
sudo systemctl restart elasticsearch
```

And try:
```sh
curl -X GET http://localhost:9200
```

## 🔍 Option 2: Use a Proper Certificate
If you want to keep security enabled but avoid -k, set up a trusted certificate:

```sh
curl --cacert /path/to/your/cert.pem -X GET https://localhost:9200
```

## 🔧 Solution: Bypass SSL Verification for Local Testing
Since Elasticsearch is using a self-signed SSL certificate, curl rejects it by default. To bypass this, use the -k (insecure) flag:

```sh
curl -X GET https://localhost:9200 -k
```
**This will ignore the SSL certificate validation and allow the request to go through.**

## ✅ Recommended Solution: Use the Self-Signed Certificate Properly
If you want to use SSL without disabling verification, add the self-signed certificate to your trusted CA store.

Find the Elasticsearch Certificate Run:

```sh
sudo find /etc/elasticsearch/ -name "*.crt"
```
**This should return something like /etc/elasticsearch/certs/http_ca.crt.**

Use the Certificate with curl

```sh
curl --cacert /etc/elasticsearch/certs/http_ca.crt -X GET https://localhost:9200
```

## 🔍 Alternative: Disable SSL (For Development Only)
If you don't need SSL, edit elasticsearch.yml and set:

```yaml
xpack.security.http.ssl.enabled: false
```

Then restart Elasticsearch:

```sh
sudo systemctl restart elasticsearch
```

Now you can use:

```sh
curl -X GET http://localhost:9200
```

## 🔐 Solution: Authenticate with Elasticsearch
Elasticsearch security is enabled, and you need to provide authentication credentials (username and password).

## 🔹 Use Basic Authentication with curl

Try running:

```sh
curl --cacert http_ca.crt -X GET https://localhost:9200 -u elastic:your_password
```
Replace your_password with the actual password for the elastic user. If you haven’t set a password, check your Elasticsearch setup logs or reset it.

## 🔹 If You Forgot the Password
Reset the password for the elastic user:

Run the following command:

```sh
elasticsearch-reset-password -u elastic
```

It will prompt you to set a new password.

Use the new password in your curl request.

## 🔹 Alternative: Disable Security for Local Development (Not Recommended for Production)
If you're working locally and don't need authentication, disable security in elasticsearch.yml:

```yaml
xpack.security.enabled: false
```

Then restart Elasticsearch:

```sh
sudo systemctl restart elasticsearch
```
Now, you can make requests without authentication:

```sh
curl --cacert http_ca.crt -X GET https://localhost:9200
```

## 🚀 Next Steps
If you're setting up Elasticsearch for production, it's best to configure a proper SSL certificate.
If this is a local setup, using -k or --cacert is fine.
#  😊