require("dotenv").config();
const { db } = require("./data");

setTimeout(async () => {
  res = await db.query("");
  console.log(res);
}, 2000);
