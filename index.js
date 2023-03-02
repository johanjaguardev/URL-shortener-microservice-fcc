require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;
const urls = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const shortUrl = urls.length + 1;

  const urlObject = new URL(originalUrl);

  if (!urlObject.protocol.startsWith("http")) {
    res.json({ error: "invalid url" });
    return;
  }

  urls.push({ originalUrl, shortUrl });
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const url = urls.find((u) => u.shortUrl == shortUrl);

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
