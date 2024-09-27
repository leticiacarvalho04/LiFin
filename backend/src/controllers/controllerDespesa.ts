import { Request, Response } from "express";
import { db } from "../config";
import Despesas from "../interface/despesas";

const colecaoDespesas = db.collection("despesas");
const colecaoCategorias = db.collection("categorias");

export default class DespesaController {
  static async cadastrarDespesa(req: Request, res: Response) {
    try {
      const dados: Despesas = req.body;

      // Verifica se a categoria existe
      const categoriaDoc = await colecaoCategorias.doc(dados.categoriaId).get();
      if (!categoriaDoc.exists) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }

      // Converte data de string para objeto Date
      const parseDate = (dateString: string): Date => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
      };
      const dataDespesa = parseDate(dados.data);

      // Gerar ID automaticamente
      const novaDespesaRef = colecaoDespesas.doc();
      const novaDespesaId = novaDespesaRef.id;

      // Gravar nova despesa
      await novaDespesaRef.set({
        id: novaDespesaId,
        nome: dados.nome,
        categoriaId: dados.categoriaId,
        valor: dados.valor,
        data: dataDespesa,
        descricao: dados.descricao,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Retorna o ID e os dados cadastrados
      const { id, ...dadosSemId } = dados;
      return res.status(201).json({ id: novaDespesaId, ...dadosSemId });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha ao cadastrar despesa" });
    }
  }

  static async listarDespesa(req: Request, res: Response) {
    try {
      const despesaSnapshot = await colecaoDespesas.get();
      const despesas = despesaSnapshot.docs.map((despesa) => {
        const dataTimestamp = despesa.data().data;

        const formattedDate = dataTimestamp.toDate().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

        return {
          id: despesa.id,
          ...despesa.data(),
          data: formattedDate,
          created_at: despesa.data().created_at.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          updated_at: despesa.data().updated_at.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        };
      });

      if (despesas.length === 0) {
        return res.status(404).json({ message: 'Nenhuma despesa encontrada' });
      }

      return res.status(200).json(despesas);
    } catch (erro) {
      return res.status(500).json({ erro: "Falha ao listar despesas" });
    }
  }
}
