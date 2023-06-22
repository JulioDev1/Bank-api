import express from "express";
import session from "express-session";
import { sequelize } from "./config/db.js";
import router from "./routes/routes.js";

const app = express();
const PORT = 8000;

sequelize.sync();

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
