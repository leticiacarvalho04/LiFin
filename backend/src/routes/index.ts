import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerCategoria";
import ReceitaController from "../controllers/controllerReceita";

const router = Router();

router.post("/cadastro/despesa", DespesaController.cadastrarDespesa);
router.post("/cadastro/receita", ReceitaController.cadastrarReceita);
router.post("/cadastro/categoria", CategoriaController.cadastrarCategoria);

router.get("/despesas", DespesaController.listarDespesas);
router.get("/receitas", ReceitaController.listarReceita);
router.get("/categorias", CategoriaController.listarCategoria);

router.put("/atualizar/categoria/:id", CategoriaController.editarCategoria);
router.put("/atualizar/despesa/:id", DespesaController.atualizarDespesa);

router.delete("/excluir/despesa/:id", DespesaController.deletarDespesa);

export default router;
