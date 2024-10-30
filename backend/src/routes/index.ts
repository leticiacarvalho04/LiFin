import { Router } from "express";
import DespesaController from "../controllers/controllerDespesa";
import CategoriaController from "../controllers/controllerDespesaCategoria";
import ReceitaController from "../controllers/controllerReceita";
import UsuarioController from "../controllers/controllerUsuario";
import AuthController from "../services/AuthController";
import { autenticarToken } from "../middleware/autenticarToken";
import CategoriaDespesaController from "../controllers/controllerDespesaCategoria";
import CategoriaReceitaController from "../controllers/controllerReceitaCategoria";
import { ControllerGastosFixos } from '../controllers/controllerGastosFixos';
import { ControllerOrcamento } from '../controllers/controllerOrcamento';

const router = Router();

// Rota de login
router.post("/login", AuthController.login);

router.post("/cadastro/usuario", UsuarioController.cadastrarUsuario)
router.post("/cadastro/despesa/categoria", autenticarToken, CategoriaDespesaController.cadastrarCategoria);
router.post("/cadastro/receita/categoria", autenticarToken, CategoriaReceitaController.cadastrarCategoria);
router.post("/cadastro/despesa", autenticarToken, DespesaController.cadastrarDespesa);
router.post("/cadastro/receita", autenticarToken, ReceitaController.cadastrarReceita);
router.post("/cadastro/gastoFixo", autenticarToken, ControllerGastosFixos.cadastrarGastosFixos);
router.post("/cadastro/orcamento", autenticarToken, ControllerOrcamento.cadastrarOrcamento);

router.get("/usuario/:id", autenticarToken, UsuarioController.listarUsuarioPorId);
router.get("/despesas/categorias", autenticarToken, CategoriaDespesaController.listarCategoria);
router.get("/receitas/categorias", autenticarToken, CategoriaReceitaController.listarCategoria);
router.get("/despesas", autenticarToken, DespesaController.listarDespesas);
router.get("/receitas", autenticarToken, ReceitaController.listarReceita);
router.get("/gastos", autenticarToken, ControllerGastosFixos.listarGastosFixos);
router.get("/orcamentos", autenticarToken, ControllerOrcamento.listarOrcamento);

router.put("/atualizar/usuario", autenticarToken, UsuarioController.atualizarUsuario);
router.put("/atualizar/despesa/categoria/:id", autenticarToken, CategoriaDespesaController.editarCategoria);
router.put("/atualizar/receita/categoria/:id", autenticarToken, CategoriaReceitaController.editarCategoria);
router.put("/atualizar/despesa/:id", autenticarToken, DespesaController.atualizarDespesa);
router.put("/atualizar/receita/:id", autenticarToken, ReceitaController.atualizarReceita);
router.put("/atualizar/gastoFixo/:id", autenticarToken, ControllerGastosFixos.atualizarGastosFixos);

router.delete("/excluir/usuario", autenticarToken, UsuarioController.deletarUsuario);
router.delete("/excluir/despesa/categoria/:id", autenticarToken, CategoriaDespesaController.excluirCategoria);
router.delete("/excluir/receita/categoria/:id", autenticarToken, CategoriaReceitaController.excluirCategoria);
router.delete("/excluir/despesa/:id", autenticarToken, DespesaController.deletarDespesa);
router.delete("/excluir/receita/:id", autenticarToken, ReceitaController.deletarReceita);
router.delete("/excluir/gastoFixo/:id", autenticarToken, ControllerGastosFixos.deletarGastosFixos);

export default router;
