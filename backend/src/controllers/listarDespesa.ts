import { Request, Response } from "express";
import { db } from "../config";
import Despesas from "../interface/despesas";

const colecaoDespesas = db.collection("despesas");

export async function listarDespesa(req: Request, res: Response) {

  const despesaSnapshot = await colecaoDespesas.get();
  const despesa = despesaSnapshot.docs.map((despesa) => ({
    id: despesa.id,
    ...despesa.data() as Omit<Despesas,'id'>
  }));

  if (!despesa) {
    return res.status(404).json({ message: 'Despesa não encontrada' });
  }

  return res.status(200).json(despesa);
}