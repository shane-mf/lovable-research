const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Configuration
const PORT = 3000;
const OUTPUT_FILE = path.join(__dirname, "request-bodies.txt");

// Helper function to decode UTF escape sequences
function decodeUTF(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

// Helper function to detect if content is gzipped
function isGzipped(buffer) {
  // Check for gzip magic number: first two bytes should be 0x1F 0x8B
  return buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

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
      const buffer = Buffer.concat(chunks);

      // Process based on content type and compression
      let processedData;

      try {
        // Check if content is gzipped
        if (isGzipped(buffer) || req.headers["content-encoding"] === "gzip") {
          console.log("Decompressing gzipped content...");
          const unzipped = zlib.gunzipSync(buffer);
          const decodedText = decodeUTF(unzipped.toString());
          processedData = decodedText;
        } else {
          // Just decode UTF characters
          processedData = decodeUTF(buffer.toString());
        }

        // Write to file
        fs.appendFile(OUTPUT_FILE, processedData, (err) => {
          if (err) {
            console.error("Error writing to file:", err);
            res.statusCode = 500;
            res.end("Error saving request data");
            return;
          }

          console.log(`Processed request body saved to ${OUTPUT_FILE}`);
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("Request body processed and saved successfully");
        });
      } catch (error) {
        console.error("Error processing request body:", error);
        res.statusCode = 500;
        res.end("Error processing request data");
      }
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
