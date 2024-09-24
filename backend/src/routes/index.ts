import { Router } from "express";
import { cadastrarDespesa } from "../controllers/cadastrarDespesa";
import { cadastrarCategoria } from "../controllers/cadastrarCategoria";
import { listarCategorias } from "../controllers/listarCategoria";
import { cadastrarReceita } from "../controllers/cadastrarReceita";
import { listarDespesa } from "../controllers/listarDespesa";
import { listarReceita } from "../controllers/listarReceita";

const router = Router();

router.post("/cadastro/despesas", cadastrarDespesa) // Rota para cadastrar despesa
router.get("/listar/despesas", listarDespesa)
router.post("/cadastro/receitas", cadastrarReceita) // Rota para cadastrar despesa
router.get("/listar/receitas", listarReceita)
router.post("/cadastro/categoria", cadastrarCategoria) 
router.get("/listar/categoria", listarCategorias)

export default router;