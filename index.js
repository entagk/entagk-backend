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
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

/**
 * bodyParser.json ===>> 
 * - Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option. 
 * - This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
 * 
 * - A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
 */
app.use(bodyParser.json({ limit: "30mb", extended: true }));
/**
 * bodyParser.urlencoded ===>>
 * Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. 
 * This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.
 * 
 * A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). 
 * This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
 */
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use("/api/user/", require("./routers/user"));

app.use("/api/task/", require("./routers/task"));

app.use("/api/setting/", require("./routers/setting"));

app.use(express.static(path.join(__dirname, 'build')));

app.get("/", function (req, res) { 
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const PORT = process.env.PORT || 5500;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}/`)
  }))
  .catch((error) => console.log("The MongoDB Error is", error.message, "%n", error));

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);