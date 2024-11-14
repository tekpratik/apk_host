const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (consider restricting for production)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const modelUrn = req.query.modelUrn;
  const accessToken = req.query.accessToken;

  // Check if the modelUrn and accessToken are provided
  if (!modelUrn || !accessToken) {
    console.log("Access Token:", window.accessToken);
    console.log("Model URN:", window.modelUrn);

    return res
      .status(400)
      .send(
        "Missing modelUrn or accessToken" +
          "accessToken" +
          window.accessToken +
          "modelUrn" +
          window.modelUrn
      );
  }

  try {
    // Making the request to Autodesk API
    const response = await axios.get(
      `https://cdn.derivative.autodesk.com/derivativeservice/v2/manifest/${modelUrn}?domain=${encodeURIComponent(
        "https://apk-host-git-main-pratiktimers-projects.vercel.app"
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data); // Forward the response from Autodesk API
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching data from Autodesk:", error.message);
    res.status(500).send("Error fetching data from Autodesk");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
