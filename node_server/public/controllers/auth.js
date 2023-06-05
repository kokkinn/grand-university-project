const { db } = require("../database/table.js");
const securityModule = require("../security/security.js");
const { hashPassword } = require("../security/security");

const authTest = (req, res) => {
  res.sendStatus(200)
}
const login = (req, res) => {
  const SQL_QUERY = `SELECT * FROM users WHERE username=?`;
  db.all(SQL_QUERY, req.body.username, async (err, rows) => {
    if (rows.length < 1)
      return res.status(404).json({ message: "Incorrect credentials u" });
    const hashedPassword = rows.at(0).password;
    if (
      await securityModule.comparePasswordsHashToPlain(
        req.body.password,
        hashedPassword
      )
    ) {
      const username = req.body.username;
      const user = { username };
      const jwtToken = securityModule.signToken(user, "1h");
      // res.cookie("Authorization", `Bearer ${jwtToken}`);
      return res.json({ token: jwtToken });
    } else {
      return res.status(403).json({ message: "Incorrect credentials p" });
    }
  });
};
const readUser = (req, res) => {
  const SQL_QUERY = `SELECT * FROM users WHERE id=?`;
  db.all(SQL_QUERY, req.params.id, (err, rows) => {
    if (rows.length < 1) res.status(404).json({ message: "No such user" });
    res.json(rows.at(0));
  });
};

function createUser(req, res) {
  const SQL_QUERY1 = `SELECT * FROM users WHERE username=?`;
  db.all(SQL_QUERY1, req.body.username, async (err, rows) => {
    if (rows.length === 1) {
      return res.status(403).json({ message: "Such user already exists" });
    }
    const hashedPassword = await securityModule.hashPassword(req.body.password);

    const SQL_QUERY = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(SQL_QUERY, [req.body.username, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });
      return res.status(201).json({ message: "User was successfully created" });
    });
  });
}

//#TODO update user
function updateUser(req, res) {
  return null;
}

function deleteUser(req, res) {
  const SQL_QUERY = `DELETE FROM users WHERE id=?`;
  db.run(SQL_QUERY, req.params.id, (err) => {
    if (err) res.status(500).json({ message: "Something went wrong" });
    res.status(200).json({ message: "User was successfully deleted" });
  });
}

module.exports.authTest = authTest;
module.exports.login = login;
module.exports.createUser = createUser;
module.exports.readUser = readUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
