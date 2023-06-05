const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(morgan("combined"));
app.use(express.json());
app.use(cors(corsOptions));

const authRouter = require("./routes/auth.js");
app.use("/auth", authRouter);
app.use("/app", appRouter)

app.listen(8000, () => console.log("Server is up and running ..."));
