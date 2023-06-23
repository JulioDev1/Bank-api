import express from "express";
import {
  createCurrentAccount,
  createPerson,
  loginUser,
} from "../controllers/pessoaController.js";
const router = express.Router();

router.post("/create", createPerson);
router.post("/login", loginUser);
router.post("/createCurrentAccount", createCurrentAccount);
export default router;
