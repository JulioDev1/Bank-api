import express from "express";
import { createPerson, loginUser } from "../controllers/pessoaController.js";
const router = express.Router();

router.post("/create", createPerson);
router.post("/login", loginUser);
export default router;
