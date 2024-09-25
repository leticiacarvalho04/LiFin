import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerCategoria";
import ReceitaController from "../controllers/controllerReceita";

const router = Router();

router.post("/cadastro/despesa", DespesaController.cadastrarDespesa) // Rota para cadastrar despesa
router.get("/despesas", DespesaController.listarDespesa)
router.post("/cadastro/receita", ReceitaController.cadastrarReceita) // Rota para cadastrar despesa
router.get("/receitas", ReceitaController.listarReceita)
router.post("/cadastro/categoria", CategoriaController.cadastrarCategoria) 
router.get("/categorias", CategoriaController.listarCategoria)

export default router;