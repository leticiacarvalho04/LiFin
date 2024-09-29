import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerCategoria";
import ReceitaController from "../controllers/controllerReceita";

const router = Router();

router.post("/cadastro/categoria", CategoriaController.cadastrarCategoria);
router.post("/cadastro/despesa", DespesaController.cadastrarDespesa);
router.post("/cadastro/receita", ReceitaController.cadastrarReceita);

router.get("/categorias", CategoriaController.listarCategoria);
router.get("/despesas", DespesaController.listarDespesas);
router.get("/receitas", ReceitaController.listarReceita);

router.put("/atualizar/categoria/:id", CategoriaController.editarCategoria);
router.put("/atualizar/despesa/:id", DespesaController.atualizarDespesa);
router.put("/atualizar/receita/:id", ReceitaController.atualizarReceita);

router.delete("/excluir/categoria/:id", CategoriaController.excluirCategoria);
router.delete("/excluir/despesa/:id", DespesaController.deletarDespesa);
router.delete("/excluir/receita/:id", ReceitaController.deletarReceita);

export default router;
