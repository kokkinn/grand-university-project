const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) console.log(err);
  }
);

const sql = `CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username, password)`
db.run(sql)

module.exports.db = db
