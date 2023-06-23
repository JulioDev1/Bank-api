import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./usuario.js";

const ContaCorrente = sequelize.define(
  "contascorrentes",
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    nome: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    saldo: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
ContaCorrente.hasMany(User, { foreignKey: "pessoa_id" });
User.belongsTo(ContaCorrente, { foreignKey: "pessoa_id" });
export { ContaCorrente };
