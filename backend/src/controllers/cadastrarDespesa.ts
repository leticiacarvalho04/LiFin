import { Request, Response } from "express";
import { db } from "../config";
import Despesas from "../interface/despesas";

const colecaoDespesas = db.collection("despesas");
const colecaoCategorias = db.collection("categorias");

export const cadastrarDespesa = async (req: Request, res: Response) => {
  try {
    const dados: Despesas = req.body; // Dados da despesa recebidos no corpo da requisição

    // Verificar se a categoria existe com base no ID da categoria
    const categoriaDoc = await colecaoCategorias.doc(dados.categoriaId).get();
    if (!categoriaDoc.exists) {
      return res.status(400).json({ erro: "Categoria não encontrada" });
    }

    // Função para converter data no formato DD/MM/YYYY para objeto Date
    const parseDate = (dateString: string): Date => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    // Converter a data recebida para objeto Date
    const dataDespesa = parseDate(dados.data);

    // Adicionar a despesa à coleção 'despesas'
    const novaDespesa = await colecaoDespesas.add({
      nome: dados.nome,
      categoriaId: dados.categoriaId, // Associar pelo ID da categoria
      valor: dados.valor,
      data: dataDespesa, // Armazenar a data como objeto Date
      descricao: dados.descricao,
      created_at: new Date(), // Definir data de criação atual
      updated_at: new Date(), // Definir data de atualização atual
    });

    res.status(201).json({ id: novaDespesa.id, ...dados }); // Retorna o ID da nova despesa e os dados cadastrados
  } catch (erro) {
    res.status(500).json({ erro: "Falha ao cadastrar despesa" }); // Trata erros
  }
};