import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./usuario.js";

const ContaCorrente = sequelize.define("contascorrente", {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numero: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  data_de_abertura: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nome: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});
User.hasMany(ContaCorrente, { foreignKey: "usuario_id" });
ContaCorrente.belongsTo(User, { foreignKey: "usuario_id" });

export { ContaCorrente };
