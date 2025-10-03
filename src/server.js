import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

let app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB(); // Connect to the database

let port = process.env.PORT || 8080;
//Port === undefined => port = 6969;
app.listen(port, () => {
  //callback
  console.log("Backend NodeJS is running on the port: " + port);
});
