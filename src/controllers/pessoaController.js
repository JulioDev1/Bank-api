import { where } from "sequelize";
import { ContaCorrente } from "../models/contaCorrente.js";
import { Movimento } from "../models/movimento.js";
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

  ContaCorrente.findOne({ where: { numero: numero } })
    .then((number) => {
      if (number) {
        return res.json({
          error: true,
          message: `conta de numero ${number} ja existente `,
        });
      } else {
        const id = req.session.user.id;

        ContaCorrente.create({
          usuario_id: id,
          numero: numero,
          nome: nome,
          saldo: saldo,
          data_de_abertura: new Date(),
        }).then((account) => {
          return res.json({
            error: false,
            message: `conta de ${account.nome} foi criado  e o deposito feitos com sucesso!`,
          });
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const AllUsersAccount = (req, res) => {
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario deslogado" });
  }

  ContaCorrente.findAll({
    where: { usuario_id: req.session.user.id },
  })
    .then((accounts) => {
      const data = accounts.map((account) => ({
        numero: account.numero,
        nome: account.nome,
        saldo: account.saldo,
      }));
      return res.json({ error: false, data: data });
    })
    .catch((error) => {
      return res.json({ error: true, message: `${error}` });
    });
};

export const viewDataAccount = (req, res) => {
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario deslogado" });
  }

  const { numero } = req.body;
  if (numero !== req.session.check.numero) {
    return res.json({
      error: true,
      message: `number is not exist ${numero}`,
    });
  }
  ContaCorrente.findOne({ numero: numero })
    .then((check) => {
      if (!check) {
        return res.json({
          error: true,
          message: "data is not exist",
        });
      }
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

export const submitTransctions = async (req, res) => {
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario deslogado" });
  }
  const { valor, contacorrente_origem, contacorrente_destino, observacao } =
    req.body;

  await ContaCorrente.findOne({
    where: { usuario_id: req.session.user.id },
    numero: contacorrente_origem,
  }).then((account) => {
    if (!account) {
      return res.json({
        error: true,
        message: `account is not exist ${account.numero}`,
      });
    }

    const newValue = account.saldo - valor;

    if (account.saldo < newValue) {
      return res.json({
        error: true,
        message: "valor baixo",
      });
    }

    ContaCorrente.update(
      { saldo: newValue },
      {
        where: {
          usuario_id: req.session.user.id,
          numero: contacorrente_origem,
        },
      }
    ).then((updatedValue) => {
      console.log(updatedValue.saldo);
    });

    Movimento.create({
      tipo: "Debito",
      contacorrente_id: account.usuario_id,
      valor: valor,
      data_de_movimento: new Date(),
      contacorrente_origem: account.numero,
      contacorrente_destino: contacorrente_destino,
      observacao: observacao,
    }).then((transaction) => {
      return res.json(transaction);
    });
  });
};
