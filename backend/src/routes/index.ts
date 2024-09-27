import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerCategoria";
import ReceitaController from "../controllers/controllerReceita";

const router = Router();

router.post("/cadastro/despesa", DespesaController.cadastrarDespesa);
router.post("/cadastro/receita", ReceitaController.cadastrarReceita);
router.post("/cadastro/categoria", CategoriaController.cadastrarCategoria);

router.get("/despesas", DespesaController.listarDespesa);
router.get("/receitas", ReceitaController.listarReceita);
router.get("/categorias", CategoriaController.listarCategoria);

router.put("/atualizar/categoria/:id", CategoriaController.editarCategoria);

export default router;
