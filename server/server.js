// Express requirements
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

import morgan from "morgan";
import path from "path";
// import forceDomain from "forcedomain";
import Loadable from "react-loadable";
import cookieParser from "cookie-parser";
import api from "./api";
import loader from "./loader";
import { createConnection } from "typeorm";
import imageHandler, { petImage, bannerImage } from "./utils/imageRetriver";
createConnection()
  .then(async () => {
    const app = express();
    const PORT = process.env.PORT || 3080;

    // NOTE: UNCOMMENT THIS IF YOU WANT THIS FUNCTIONALITY
    /*
  Forcing www and https redirects in production, totally optional.

  http://mydomain.com
  http://www.mydomain.com
  https://mydomain.com

  Resolve to: https://www.mydomain.com
*/
    // if (process.env.NODE_ENV === 'production') {
    //   app.use(
    //     forceDomain({
    //       hostname: 'www.mydomain.com',
    //       protocol: 'https'
    //     })
    //   );
    // }

    // Compress, parse, log, and raid the cookie jar
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }
    app.use(cookieParser());
    app.get("/images/banner/:image?", bannerImage);
    app.get("/images/pet/:image?", petImage);
    app.get("/images/:image?", imageHandler);
    app.use("/api", api); //All API routes

    // Set up homepage, static assets, and capture everything else
    app.use(express.Router().get("/", loader));
    // public url for the app

    app.use(express.static(path.resolve(__dirname, "../build")));
    app.use(loader);
    // We tell React Loadable to load all required assets and start listening - ROCK AND ROLL!
    Loadable.preloadAll().then(() => {
      app.listen(PORT, console.log(`App listening on port ${PORT}!`));
    });

    // Handle the bugs somehow
    app.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  })
  .catch((error) => console.log(error));
