import { Request, Response } from "express";
import { db } from "../config";
import Categoria from "../interface/categoria"; // Interface 'Categoria' sem o campo 'id'

const colecaoCategorias = db.collection("categorias");

export const listarCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoriasSnapshot = await colecaoCategorias.get(); // Obtém os documentos
    const categorias = categoriasSnapshot.docs.map(doc => ({
      id: doc.id, // ID gerado pelo Firestore
      ...doc.data() as Omit<Categoria, 'id'> // Exclui 'id' dos dados retornados
    }));

    res.status(200).json(categorias); // Retorna as categorias como JSON
  } catch (erro) {
    res.status(500).json({ erro: "Falha ao listar categorias" });
  }
};
