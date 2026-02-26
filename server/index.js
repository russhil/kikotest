import path from "path";
import fs from "fs";

import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";

import App from "../src/App";
const logoUrl = "https://shops.kiko.live/kiko-logo-white.png";
const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.static("./build"));

app.get("/*", (req, res) => {
  const app = renderToString(<App />);

  const indexFile = path.resolve("./build/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.get("/webinar-registration-lead2", function (request, response) {
  try {
    const indexFile = path.resolve("./build/index.html");
    fs.readFile(indexFile, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      data = data.replace(
        /\$OG_TITLE/g,
        "Free Restaurant Registration | Sell on Own Website"
      );
      data = data.replace(
        /\$OG_TWITTER_TITLE/g,
        "Free Restaurant Registration | Sell on Own Website"
      );
      data = data.replace(/\$OG_IMAGE/g, logoUrl);
      var result = data.replace(
        /\$OG_DESCRIPTION/g,
        "Start getting website orders within 24 hours. Best solution for Restaurants. Easy 2 minute registration. Best Customer Support. Free Ecommerce Website."
      );
      response.send(result);
    });
  } catch (error) {
    console.log("error", error);
    return response.sendFile(filePath);
  }
});

app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});
