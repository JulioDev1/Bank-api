import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Pessoa } from "./pessoa.js";

const User = sequelize.define("users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pessoa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      key: "id",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { User };
