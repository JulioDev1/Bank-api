import express from "express";
import { createPerson } from "../controllers/pessoaController.js";
const router = express.Router();

router.post("/", createPerson);
export default router;
