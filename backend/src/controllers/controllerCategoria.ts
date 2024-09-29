import { Request, Response } from "express";
import { db } from "../config";
import Categoria from "../interface/categoria";

const colecaoCategorias = db.collection("categorias");

export default class CategoriaController {
    static async cadastrarCategoria(req: Request, res: Response) {
        try {
            const dados: Categoria = req.body;
            const novaCategoria = await colecaoCategorias.add(dados);

            const { id, ...dadosSemId } = dados;
            res.status(201).json({ id: novaCategoria.id, ...dadosSemId });
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao cadastrar categoria" });
        }
    }

    static async listarCategoria(req: Request, res: Response): Promise<void> {
        try {
            const categoriasSnapshot = await colecaoCategorias.get();
            const categorias = categoriasSnapshot.docs.map(doc => ({
                id: doc.id, // ID gerado pelo Firestore
                ...doc.data() as Omit<Categoria, 'id'>
            }));

            res.status(200).json(categorias);
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao listar categorias" });
        }
    }

    static async editarCategoria(req: Request, res: Response) {
        try {
            const { id } = req.params;
            console.log("ID recebido:", id);
            const dadosAtualizados: Partial<Categoria> = req.body;
            console.log("Dados recebidos para atualização:", dadosAtualizados);
    
            const categoriaSnapshot = await colecaoCategorias.doc(id).get();
            if (!categoriaSnapshot.exists) {
                res.status(404).json({ erro: "Categoria não encontrada" });
                return;
            }
    
            await colecaoCategorias.doc(id).update(dadosAtualizados);
            res.status(200).json({ id, ...dadosAtualizados });
        } catch (erro) {
            console.error("Erro ao editar categoria:", erro); // Log completo do erro
            res.status(500).json({ erro: "Falha ao editar categoria" });
        }
    }   
    
    static async excluirCategoria(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await colecaoCategorias.doc(id).delete();
            res.status(204).end();
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao excluir categoria" });
        }
    }
}