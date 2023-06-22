import { where } from "sequelize";
import { Pessoa, User } from "../models/pessoa.js";

export const createPerson = (req, res) => {
  const {
    nome,
    cpf,
    data_de_nascimento,
    telefone,
    endereco,
    cep,
    email,
    password,
  } = req.body;
  try {
    Pessoa.create({
      nome: nome,
      cpf: cpf,
      data_de_nascimento: data_de_nascimento,
      telefone: telefone,
      endereco: endereco,
      cep: cep,
    })
      .then((result) => {
        console.log("resultado dessa jossa", result);

        User.create({
          pessoa_id: result.id,
          email: email,
          password: password,
        });

        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    return res.json({
      error: true,
      message: `error is ${error}`,
    });
  }
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email, password: password } }).then(
    (result) => {
      if (!result) {
        return res.json({ error: true, message: "not exist user " });
      }
      req.session.authorized = true;
      req.session.user = result;
      Pessoa.findOne({ where: { id: result.id } })
        .then((userData) => {
          console.log(userData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};
