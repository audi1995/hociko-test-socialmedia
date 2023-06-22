const express = require('express')
const app = express()
var bodyParser = require("body-parser");
require("dotenv").config();
const con = require('./db')
const router = require("./app/routers/index.route");

app.use(express.json());
app.use(bodyParser.json());
router(app)

const port = process.env.PORT


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})