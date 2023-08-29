const express = require("express");
const path = require("path");
/**
 * some notes about body-parser from express docs:
 * body-parser is Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 */
const bodyParser = require("body-parser");

/**
 * CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
 */
const cors = require("cors");
const dotenv = require("dotenv");
// const fileUpload = require('express-fileupload');
const app = express();

dotenv.config();

/**
 * bodyParser.json ===>> 
 * - Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option. 
 * - This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
 * 
 * - A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
 */
app.use(bodyParser.json({ limit: "50mb", extended: true }));
/**
 * bodyParser.urlencoded ===>>
 * Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. 
 * This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
 * 
 * A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). 
 * This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
 */
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },
// }));

app.use(cors());

app.use('/api/upload/', require('./routers/upload'));

app.use("/api/user/", require("./routers/user"));

app.use("/api/task/", require("./routers/task"));

app.use("/api/setting/", require("./routers/timerGeneralSetting"));

app.use("/api/template/", require("./routers/template"));

app.use('/api/leaderboard', require('./routers/leaderboard'));

app.use('/api/active', require('./routers/active'));

app.use(express.static(path.join(__dirname, 'build')));

// use "*" for making make the react-router-dom working
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

module.exports = app;
