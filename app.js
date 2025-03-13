const express = require('express');
const dbConnection = require('./database/db');
const route = require('./src/modules/user/routes/index')
const config = require("./config/default");
const errorHandler = require("./src/lib/error");
const swaggerRoutes = require('./apiDoc/index');

const app = express();
app.use(express.json());
dbConnection();

// swagger-doc
app.use(swaggerRoutes) // swagger docs.

app.use("/api/um/users", route); // routes
app.use(errorHandler); // global error handling

app.listen(config.PORT, ()=> {
    console.log(`Successfully connected to http://localhost:${ config.PORT }`);
})


// rediss implementation in all routes.