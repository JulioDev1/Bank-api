import { json } from "sequelize";
import { ContaCorrente } from "../models/contaCorrente.js";
import { Movimento } from "../models/movimento.js";
import { Pessoa, User } from "../models/pessoa.js";

export const createPerson = async (req, res) => {
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
  console.log(req.body);
  try {
    const cpfAlreadyExist = await Pessoa.findOne({ where: { cpf } });
    if (cpfAlreadyExist) {
      return res.json({ error: true, message: " cpf user already exist" });
    }

    const emailAlreadyExist = await User.findOne({ where: { email } });

    if (emailAlreadyExist) {
      return res.json({
        error: true,
        message: "email already exist",
      });
    }
    console.log(`valores retornado ${cpfAlreadyExist}`);

    const AccountCreate = await Pessoa.create({
      nome,
      cpf,
      data_de_nascimento,
      telefone,
      endereco,
      cep,
    });
    const user = await User.create({
      pessoa_id: AccountCreate.id,
      email,
      password,
    });

    return res.json({
      message: "usuario criado com sucesso",
      nome,
      user,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: `error is ${error}`,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email: email, password: password },
  });

  if (!user) {
    return res.json({ error: true, message: "not exist user " });
  }

  req.session.authorized = true;

  req.session.user = user;

  const person = await Pessoa.findOne({ where: { id: user.id } });

  return res.json({ error: false, message: `welcome ${person.nome}` });
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
  const { valor, contacorrente_origem, contacorrente_destino } = req.body;

  const accountOrigem = await ContaCorrente.findOne({
    where: { usuario_id: req.session.user.id },
    numero: contacorrente_origem,
  });
  console.log("daskldjaslkdasldlaks", accountOrigem);
  if (!accountOrigem) {
    return res.json({
      error: true,
      message: `account is not exist ${account.numero}`,
    });
  }

  if (accountOrigem.saldo === 0) {
    return res.json({
      error: true,
      message: `saldo abaixo para envio!`,
    });
  }

  const newValue = accountOrigem.saldo - parseFloat(valor);

  if (accountOrigem.saldo < newValue) {
    return res.json({
      error: true,
      message: "valor baixo",
    });
  }

  await ContaCorrente.update(
    { saldo: newValue },
    { where: { id: accountOrigem.id } }
  ).then((updatedValue) => {
    return updatedValue.saldo;
  });

  const transactionCreate = await Movimento.create({
    tipo: "Credito",
    contacorrente_id: accountOrigem.usuario_id,
    valor: valor,
    data_de_movimento: new Date(),
    contacorrente_origem: accountOrigem.numero,
    contacorrente_destino: contacorrente_destino,
    observacao: "envio",
  });

  const accountDestino = await ContaCorrente.findOne({
    where: { numero: contacorrente_destino },
  });

  if (!accountDestino) {
    return res.json({
      error: true,
      message: "conta nao existe",
    });
  }

  const destinyValue = accountDestino.saldo + parseFloat(valor);

  await ContaCorrente.update(
    { saldo: destinyValue },
    { where: { id: accountDestino.id } }
  ).then((updatedValue) => {
    return updatedValue.saldo;
  });

  const transactionDestiny = await Movimento.create({
    tipo: "Debito",
    contacorrente_id: accountDestino.usuario_id,
    valor: valor,
    data_de_movimento: new Date(),
    contacorrente_origem: contacorrente_origem,
    contacorrente_destino: contacorrente_destino,
    observacao: "recebimento",
  });

  return res.json({ transactionDestiny, transactionCreate });
};

export const listAllTransactions = async (req, res) => {
  if (!req.session.user) {
    return res.json({ error: true, message: "usuario deslogado" });
  }

  const findAllTransactions = await Movimento.findAll({
    where: { contacorrente_id: req.session.user.id },
  });

  if (!findAllTransactions) {
    return res.json({
      message: "nao há transações nessa conta ainda!",
    });
  }

  const data = await findAllTransactions.map((transaction) => ({
    tipo: transaction.tipo,
    valor: transaction.valor,
    data_de_movimento: transaction.data_de_movimento,
    contacorrente_origem: transaction.contacorrente_origem,
    contacorrente_destino: transaction.contacorrente_destino,
    observacao: transaction.observacao,
  }));
  return res.json({ error: false, data });
};
