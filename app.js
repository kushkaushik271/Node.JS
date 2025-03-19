const express = require("express");
const dbConnection = require("./database/db");
const route = require("./src/modules/user/routes/index");
const config = require("./config/default");
const errorHandler = require("./src/lib/error");
const swaggerRoutes = require("./apiDoc/index");
const roleRouter = require("./src/modules/roles/routes");
const redisClient = require("./src/lib/redisClient");

const app = express();
app.use(express.json());
dbConnection();

/* eslint-disable */
redisClient.on("error", (err) => console.error("Redis Client Error:", err)); // Initialize Redis connection in server.js
redisClient.connect();
 

// swagger-doc
app.use(swaggerRoutes); // swagger docs.

app.use("/api/um/users", route); // routes
app.use("/api/um/roles", roleRouter);
app.use(errorHandler); // global error handling

/* eslint-disable */
app.listen(config.PORT, () => {
  console.log(`Successfully connected to http://localhost:${config.PORT}`);
});
/* eslint-disable */