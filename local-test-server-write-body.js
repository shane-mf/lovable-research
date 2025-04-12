const http = require("http");
const fs = require("fs");
const path = require("path");

// Configuration
const PORT = 3000;
const OUTPUT_FILE = path.join(__dirname, "request-bodies.txt");

const server = http.createServer((req, res) => {
  // Only process POST requests
  if (req.method === "POST") {
    console.log(`Received ${req.method} request to ${req.url}`);

    // Collect data chunks
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // Process the complete request body
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString();
      const timestamp = new Date().toISOString();
      const dataToWrite = `\n--- Request at ${timestamp} ---\n${body}\n`;

      // Write to file
      fs.appendFile(OUTPUT_FILE, dataToWrite, (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          res.statusCode = 500;
          res.end("Error saving request data");
          return;
        }

        console.log(`Request body saved to ${OUTPUT_FILE}`);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Request body saved successfully");
      });
    });
  } else {
    // Handle non-POST requests
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Send a POST request to save data to file");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Request bodies will be saved to ${OUTPUT_FILE}`);
});
