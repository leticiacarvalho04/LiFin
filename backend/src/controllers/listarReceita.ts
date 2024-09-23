import { Request, Response } from "express";
import { db } from "../config";
import Receitas from "../interface/receitas";

const colecaoReceitas = db.collection("receitas");

export async function listarReceita(req: Request, res: Response) {

  const receitaSnapshot = await colecaoReceitas.get();
  const receita = receitaSnapshot.docs.map((receita) => ({
    id: receita.id,
    ...receita.data() as Omit<Receitas,'id'>
  }));

  if (!receita) {
    return res.status(404).json({ message: 'receita não encontrada' });
  }

  return res.status(200).json(receita);
}