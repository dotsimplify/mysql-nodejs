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
// var dbConfig = {
//   host: process.env.DB_HOST || "sql156.main-hosting.eu",
//   user: process.env.DB_USER || "u914229342_subhash227",
//   password: process.env.DB_PASSWORD || "Mysqldatabase@999",
//   database: process.env.DB_DATABASE_NAME || "u914229342_devtest",
// };

// var connection;
// function handleDisconnect() {
//   connection = mysql.createConnection(dbConfig); // Recreate the connection, since the old one cannot be reused.
//   connection.connect(function onConnect(err) {
//     // The server is either down
//     if (err) {
//       // or restarting (takes a while sometimes).
//       console.log("error when connecting to db:", err);
//       console.log("connected");
//       setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
//     } // to avoid a hot loop, and to allow our node script to
//   }); // process asynchronous requests in the meantime.
//   // If you're also serving http, display a 503 error.
//   connection.on("error", function onError(err) {
//     console.log("db error", err);
//     if (err.code == "PROTOCOL_CONNECTION_LOST" || err.code == "ECONNRESET") {
//       // Connection to the MySQL server is usually
//       handleDisconnect(); // lost due to either server restart, or a
//     } else {
//       // connnection idle timeout (the wait_timeout
//       throw err; // server variable configures this)
//     }
//   });
// }
// handleDisconnect();
// db.connect((err) => {
//   if (err) throw err;
//   console.log("My SQL connected...");
// });

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
app.listen(port, () => {
  console.log("server running at " + port);
});
