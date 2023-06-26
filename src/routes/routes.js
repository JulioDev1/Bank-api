import express from "express";
import {
  AllUsersAccount,
  createCurrentAccount,
  createPerson,
  listAllTransactions,
  loginUser,
  submitTransctions,
  viewDataAccount,
} from "../controllers/pessoaController.js";
const router = express.Router();

router.post("/create", createPerson);
router.post("/login", loginUser);
router.post("/createCurrentAccount", createCurrentAccount);
router.get("/allUserList", AllUsersAccount);
router.get("/dataUser", viewDataAccount);
router.put("/submitTransActions", submitTransctions);
router.get("/listUserTransactions", listAllTransactions);
export default router;
