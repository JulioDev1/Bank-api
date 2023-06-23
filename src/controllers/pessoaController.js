// import { ContaCorrente } from "../models/contaCorrente.js";
import { ContaCorrente } from "../models/contaCorrente.js";
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

        return res.json({
          message: "usuario criado com sucesso",
          nome: nome,
        });
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
          return res.json({
            error: false,
            message: ` bem vindo !${userData.nome}`,
            userData,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};
export const createCurrentAccount = (req, res) => {
  const { numero, nome, saldo } = req.body;
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario nao pode criar conta!" });
  }
  const id = req.session.user.id;

  ContaCorrente.create({ usuario_id: id, numero, nome, saldo })
    .then((account) => {
      res.session.check = account;
      return res.json({
        error: false,
        message: `conta de ${account.nome} foi criado  e o deposito feitos com sucesso!`,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const viewDataAccount = (req, res) => {
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario deslogado" });
  }

  const { numero } = req.body;

  if (!numero) {
    return res.json({ error: true, message: "numero n existe" });
  }

  ContaCorrente.findOne({ numero: numero })
    .then((check) => {
      return res.json({
        error: false,
        message: "dados da conta",
        check: check,
      });
    })
    .catch((error) => {
      return res.json({ message: `erro btw ${error}` });
    });
};
