import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { ContaCorrente } from "./contaCorrente.js";

const Movimento = sequelize.define("movimento", {
  contacorrente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  data_de_movimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  contacorrente_origem: {
    type: DataTypes.INTEGER,
  },
  contacorrente_destino: {
    type: DataTypes.INTEGER,
  },
  observacao: {
    type: DataTypes.STRING,
  },
});

ContaCorrente.hasMany(Movimento, { foreignKey: "contacorrente_id" });
Movimento.belongsTo(ContaCorrente, { foreignKey: "contacorrente_id" });

export { Movimento };
