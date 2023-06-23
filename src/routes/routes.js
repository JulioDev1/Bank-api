import express from "express";
import {
  createCurrentAccount,
  createPerson,
  loginUser,
  viewDataAccount,
} from "../controllers/pessoaController.js";
const router = express.Router();

router.post("/create", createPerson);
router.post("/login", loginUser);
router.post("/createCurrentAccount", createCurrentAccount);
router.get("/dataUser", viewDataAccount);
export default router;
