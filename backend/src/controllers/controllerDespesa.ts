import { Request, Response } from "express";
import { db } from "../config";
import Despesas from "../interface/despesas";

const colecaoDespesas = db.collection("despesas");
const colecaoCategorias = db.collection("categorias");

export default class DespesaController {
  static async cadastrarDespesa(req: Request, res: Response) {
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
  }

  static async listarDespesa(req: Request, res: Response) {
    try {
      const despesaSnapshot = await colecaoDespesas.get();
      const despesas = despesaSnapshot.docs.map((despesa) => {
        const dataTimestamp = despesa.data().data; // Supondo que 'data' seja o campo do timestamp

        // Converte o timestamp em uma data legível
        const formattedDate = dataTimestamp.toDate().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        return {
          id: despesa.id,
          ...despesa.data() as Omit<Despesas, 'id'>,
          data: formattedDate, // A data agora está formatada
          updated_at: despesa.data().updated_at.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          created_at: despesa.data().created_at.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      });

      if (despesas.length === 0) {
        return res.status(404).json({ message: 'Despesa não encontrada' });
      }

      return res.status(200).json(despesas);
    } catch (erro) {
      res.status(500).json({ erro: "Falha ao listar despesas" }); // Trata erros
    }
  }
}