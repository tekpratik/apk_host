const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const modelUrn = req.query.modelUrn;
  const accessToken = req.query.accessToken;

  try {
    const response = await axios.get(
      `https://cdn.derivative.autodesk.com/derivativeservice/v2/manifest/${modelUrn}?domain=${encodeURIComponent(
        "https://test.nexgen.am"
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data); // Forward the response from Autodesk API
  } catch (error) {
    res.status(500).send("Error fetching data from Autodesk");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
