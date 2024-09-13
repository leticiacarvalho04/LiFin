import { Request, Response } from "express";
import { db } from "../config";
import Categoria from "../interface/categoria";

const colecaoCategorias = db.collection("categorias");

export const cadastrarCategoria = async (req: Request, res: Response) => {
    try {
        const dados: Categoria = req.body; // Dados da categoria recebidos no corpo da requisição
        const novaCategoria = await colecaoCategorias.add(dados); // Adiciona a categoria à coleção 'categorias'
        
        const { id, ...dadosSemId } = dados;
        res.status(201).json({ id: novaCategoria.id, ...dadosSemId }); // Retorna o ID da nova categoria e os dados cadastrados
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao cadastrar categoria" }); // Trata erros
    }
}