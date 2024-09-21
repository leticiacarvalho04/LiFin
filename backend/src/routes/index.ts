import { Router } from "express";
import { cadastrarDespesa } from "../controllers/cadastrarDespesa";
import { cadastrarCategoria } from "../controllers/cadastrarCategoria";
import { listarCategorias } from "../controllers/listarCategoria";
import { cadastrarReceita } from "../controllers/cadastrarReceita";

const router = Router();

router.post("/cadastro/despesas", cadastrarDespesa) // Rota para cadastrar despesa
router.post("/cadastro/receitas", cadastrarReceita) // Rota para cadastrar despesa
router.post("/cadastro/categoria", cadastrarCategoria) 
router.get("/listar/categoria", listarCategorias)

export default router;