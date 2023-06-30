import express from "express";
import session from "express-session";
import { sequelize } from "./config/db.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();
const PORT = 8000;
sequelize.sync();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "asdjkasd",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.static("src"));
app.use(router);

app.listen(PORT, function () {
  console.log(`app is running in port ${PORT}`);
});
