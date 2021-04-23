const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 5000;
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.set("view engine", "ejs");

var db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE_NAME || "devtest",
});

db.connect((err) => {
  if (err) throw err;
  console.log("My SQL connected...");
});

app.get("/", (req, res) => {
  res.render("index", { message: "" });
});

app.post("/", (req, res) => {
  let entry = {
    name: req.body.name,
    date: req.body.dob,
    number: req.body.phone,
    distance: req.body.distance,
  };
  console.log({ entry });
  let sql = "INSERT INTO data SET ?";
  let query = db.query(sql, entry, (err) => {
    if (err) throw err;
    res.render("index", { message: "данные успешно отправлены" });
  });
});

app.get("/show-all", (req, res) => {
  let sql = "SELECT * FROM data";
  let query = db.query(sql, (err, result) => {
    if (err) res.send("error occured while loading, Please refresh page");
    res.render("form", { records: result });
  });
});
app.listen(port, () => {
  console.log("server running at " + port);
});
