import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pessoa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
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
