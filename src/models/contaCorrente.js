import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./usuario.js";

const ContaCorrente = sequelize.define(
  "contascorrente",
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
    timestamps: false,
  }
);
User.hasMany(ContaCorrente, { foreignKey: "usuario_id" });
ContaCorrente.belongsTo(User, { foreignKey: "usuario_id" });

export { ContaCorrente };
