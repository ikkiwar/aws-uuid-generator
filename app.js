// Módulos requeridos
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
var compression = require("compression");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const httpsServerOptions = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH),
};

const app = express();
app.use(helmet()); // Ayuda a proteger aplicaciones Express
app.use(compression());
app.use(cors());
// Servidor HTTP
const serverHttp = http.createServer(app);
serverHttp.listen(process.env.HTTP_PORT, process.env.IP);

const serverHttps = https.createServer(httpsServerOptions, app);
serverHttps.listen(process.env.HTTPS_PORT, process.env.IP);

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

app.use(express.static("./public"));
// Prueba
app.get("/api/get-uuid", function (req, res) {
  res.send(uuidv4());
});

app.get("*", function (req, res) {
  res.status(404).send("404 Not Found");
});
