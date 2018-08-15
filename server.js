const express = require("express");
const app = express();
const fetch = require("node-fetch");

creds = process.env.KELNER_CRED ? JSON.parse(process.env.KELNER_CRED) : {url: "localhost:8080", secret: "secret"}

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/map.html");
});

app.get("/data", function(req, res) {
  fetch(creds.url, { method: "GET", headers: {"secret-key": creds.secret}})
    .then(data => {
      return data.json();
    })
    .then(json => {
      res.json(json);
    })
    .catch(err => {
      console.log(err);
      res.json([]);
    });
});

var port = process.env.PORT || 8080;
console.log("listening on port " + port);
app.listen(port);
