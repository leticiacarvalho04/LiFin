import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerCategoria";
import ReceitaController from "../controllers/controllerReceita";
import UsuarioController from "../controllers/controllerUsuario";
import AuthController from "../services/AuthController";
import { autenticarToken } from "../middleware/autenticarToken";

const router = Router();

// Rota de login
router.post("/login", AuthController.login);

router.post("/cadastro/usuario", UsuarioController.cadastrarUsuario)
router.post("/cadastro/categoria", autenticarToken, CategoriaController.cadastrarCategoria);
router.post("/cadastro/despesa", autenticarToken, DespesaController.cadastrarDespesa);
router.post("/cadastro/receita", autenticarToken, ReceitaController.cadastrarReceita);

router.get("/usuarios", autenticarToken, UsuarioController.listarUsuario);
router.get("/usuario/:id", autenticarToken, UsuarioController.listarUsuarioPorId);
router.get("/categorias", autenticarToken, CategoriaController.listarCategoria);
router.get("/despesas", autenticarToken, DespesaController.listarDespesas);
router.get("/receitas", autenticarToken, ReceitaController.listarReceita);

router.put("/atualizar/categoria/:id", autenticarToken, CategoriaController.editarCategoria);
router.put("/atualizar/despesa/:id", autenticarToken, DespesaController.atualizarDespesa);
router.put("/atualizar/receita/:id", autenticarToken, ReceitaController.atualizarReceita);

router.delete("/excluir/categoria/:id", autenticarToken, CategoriaController.excluirCategoria);
router.delete("/excluir/despesa/:id", autenticarToken, DespesaController.deletarDespesa);
router.delete("/excluir/receita/:id", autenticarToken, ReceitaController.deletarReceita);

export default router;
