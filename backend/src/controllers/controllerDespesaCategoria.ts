import { Response } from "express";
import Categoria from "../interface/categoria";
import { db } from "../config";
import { Usuario } from "../interface/usuario";
import { AuthenticatedRequest } from "../middleware/autenticarToken";

const colecaoCategorias = db.collection("categoriaDespesa");

export default class CategoriaDespesaController {
    static async cadastrarCategoria(req: AuthenticatedRequest, res: Response) {
        try {
            const dados: Categoria = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Adicionando o ID do usuário logado na categoria
            const userId = req.usuarioAutenticado.uid; // O middleware de autenticação já inseriu o uid em req.usuarioAutenticado
            const novaCategoria = await colecaoCategorias.add({
                ...dados,
                userId // Vincula o id do usuário logado a esta categoria
            });

            const { id, ...dadosSemId } = dados;
            res.status(201).json({ id: novaCategoria.id, ...dadosSemId });
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao cadastrar categoria" });
        }
    }

    static async listarCategoria(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const categoriasSnapshot = await colecaoCategorias
                .where("userId", "==", req.usuarioAutenticado.uid) // Filtra categorias por ID do usuário autenticado
                .get();

            const categorias = categoriasSnapshot.docs.map(doc => ({
                id: doc.id, // ID gerado pelo Firestore
                ...doc.data() as Omit<Categoria, 'id'>
            }));
            console.log("Categorias:", categorias);

            return res.status(200).json(categorias);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar categorias" });
        }
    }

    static async editarCategoria(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const dadosAtualizados: Partial<Categoria> = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const categoriaSnapshot = await colecaoCategorias.doc(id).get();
            if (!categoriaSnapshot.exists) {
                res.status(404).json({ erro: "Categoria não encontrada" });
                return;
            }

            // Verifica se a categoria pertence ao usuário autenticado
            const categoriaData = categoriaSnapshot.data();
            if (categoriaData?.userId !== req.usuarioAutenticado.uid) {
                return res.status(403).json({ erro: "Acesso negado. Esta categoria não pertence a você." });
            }

            await colecaoCategorias.doc(id).update(dadosAtualizados);
            res.status(200).json({ id, ...dadosAtualizados });
        } catch (erro) {
            console.error("Erro ao editar categoria:", erro);
            res.status(500).json({ erro: "Falha ao editar categoria" });
        }
    }

    static async excluirCategoria(req: AuthenticatedRequest, res: Response) {
        const { id } = req.params; // ID da categoria a ser excluída
    
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }
    
            // Busca a categoria pelo ID
            const categoriaSnapshot = await colecaoCategorias.doc(id).get();
    
            // Se a categoria não existir, retorna erro 404
            if (!categoriaSnapshot.exists) {
                return res.status(404).json({ erro: "Categoria não encontrada" });
            }
    
            // Verifica se a categoria pertence ao usuário autenticado
            const categoriaData = categoriaSnapshot.data();
            if (categoriaData?.userId !== req.usuarioAutenticado.uid) {
                return res.status(403).json({ erro: "Acesso negado. Esta categoria não pertence a você." });
            }
    
            // Exclui apenas a categoria, sem afetar as despesas relacionadas
            await colecaoCategorias.doc(id).delete();
    
            // Retorna sucesso com status 204 (sem conteúdo)
            return res.status(204).end();
        } catch (erro) {
            // Em caso de erro, retorna status 500
            return res.status(500).json({ erro: "Falha ao excluir categoria" });
        }
    }        
}
