const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const securityModule = require("./security/security.js");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
// app.use('/protected', securityModule.authenticateToken)
app.use(express.static("public/static"));
app.use(cookieParser());

app.use(function (req, res, next) {
  if (req.path.indexOf("/calculator") === 0) {
    if (!securityModule.authenticateToken(req, res, next)){
      return res.redirect("/loginForm.html");}
  }
  console.log('A')
  return next();
});

// app.use((req, res, next) => {
//   securityModule.authenticateToken(req, res, next);
// });

app.use(express.static("protected"));

app.use(morgan("combined"));
app.use(express.json());
app.use(cors(corsOptions));

const authRouter = require("./routes/auth.js");
const appRouter = require("./routes/apps.js");
app.use("/auth", authRouter);
// app.use("/app", appRouter);
// app.get("/cookie", (req, res) => {
//   res.cookie("cookieName", "14838", { maxAge: 900000, httpOnly: true });
//   console.log(req.cookies);
//   res.sendStatus(200);
// });

app.listen(8000, () => console.log("Server is up and running ..."));
