require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const PRIVATE_DATA = { data: "ya xo4y pizzy" };
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json());
app.listen(8000, () => console.log("Server is up and running ..."));
app.get("/", authenticateToken, (request, response) => {
  response.json(PRIVATE_DATA);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { username };
  const jwtToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
  // res.cookie("Authorization", `Bearer ${jwtToken}`);
  res.json({ token: jwtToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ").at(1);
  if (token === null) return res.sendStatus(401);
  console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
