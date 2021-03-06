
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const api = require('./server/router');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Server config
 */
function config() {
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
}

/**
 * Endpoints Config
 */
function routerConfig() {
  app.use(express.static(__dirname + "/dist/ruta-turistica-del-norte"));
  app.use('/api', api);
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname + "/dist/ruta-turistica-del-norte/index.html"));
  });
}

// functions invocations
config();
routerConfig();

//Set Port
app.listen(process.env.PORT || 5000);