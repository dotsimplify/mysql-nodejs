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
var db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE_NAME || "devtest",
});
app.get("/", (req, res) => {
  res.render("index", { message: "" });
});

app.post("/", async (req, res) => {
  try {
    let entry = {
      name: req.body.name,
      date: req.body.dob,
      number: req.body.phone,
      distance: req.body.distance,
    };
    console.log({ entry });
    let sql = "INSERT INTO data SET ?";
    let query = await db.query(sql, entry, (err) => {
      if (err) throw err;
      res.render("index", { message: "данные успешно отправлены" });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/show-all", async (req, res) => {
  try {
    let sql = "SELECT * FROM data";
    let query = await db.query(sql, (err, result) => {
      if (err) console.error(err);
      res.render("form", { records: result });
    });
  } catch (error) {
    console.log(error);
  }
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
app.listen(port, () => {
  console.log("server running at " + port);
});
