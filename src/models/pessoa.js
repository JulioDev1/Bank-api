import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./usuario.js";
const Pessoa = sequelize.define("pessoas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  data_de_nascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cep: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Pessoa.hasOne(User, { foreignKey: "pessoa_id", allowNull: false });

User.belongsTo(Pessoa, { foreignKey: "pessoa_id" });

export { Pessoa, User };
