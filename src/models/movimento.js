import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Movimento = sequelize.define("movimento", {
  contaconrrente: {
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
    type: Date,
    allowNull: false,
  },
  contaconrrente_origem: {
    type: DataTypes.BIGINT,
  },
  contaconrrente_destino: {
    type: DataTypes.BIGINT,
  },
  observacao: {
    type: DataTypes.STRING,
  },
});
export { Movimento };
