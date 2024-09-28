import { Request, Response } from "express";
import { db } from "../config"; // Importa a configuração do Firebase
import Despesas from "../interface/despesas"; // Importa a interface Despesas

const colecaoDespesas = db.collection("despesas");
const colecaoCategorias = db.collection("categorias");

export default class DespesaController {
  static async cadastrarDespesa(req: Request, res: Response) {
    try {
      const dados: Despesas = req.body;

      // Verificar se a data está no formato DD-MM-YYYY
      if (!/^\d{2}-\d{2}-\d{4}$/.test(dados.data)) {
        return res.status(400).json({ erro: 'Formato de data inválido. Use DD-MM-YYYY.' });
      }

      const [dia, mes, ano] = dados.data.split('-');

      // Verifica se o ano é válido (ex: 1900 - 2100)
      const anoNumero = parseInt(ano, 10);
      if (anoNumero < 1900 || anoNumero > 2100) {
        return res.status(400).json({ erro: 'Ano deve estar entre 1900 e 2100.' });
      }

      // Converter a data para o formato YYYY-MM-DD para salvar no Firestore
      const dataFormatada = `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD

      // Verifica se a categoria existe
      const categoriaId = String(dados.categoriaId); // Converter para string
      if (!categoriaId) {
        return res.status(400).json({ erro: "ID da categoria é obrigatório." });
      }

      const categoriaDoc = await colecaoCategorias.doc(categoriaId).get();
      if (!categoriaDoc.exists) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }

      // Gerar ID automaticamente
      const novaDespesaRef = colecaoDespesas.doc();
      const novaDespesaId = novaDespesaRef.id;

      // Gravar nova despesa
      await novaDespesaRef.set({
        id: novaDespesaId,
        nome: dados.nome,
        categoriaId: categoriaId, // Agora é uma string
        valor: dados.valor,
        data: dataFormatada,
        descricao: dados.descricao,
      });

      // Retorna o ID e os dados cadastrados
      const { id, ...dadosSemId } = dados;
      return res.status(201).json({ id: novaDespesaId, ...dadosSemId });
    } catch (erro) {
      console.error("Erro ao cadastrar despesa:", erro);
      return res.status(500).json({ erro: "Falha ao cadastrar despesa" });
    }
  }

  static async listarDespesa(req: Request, res: Response) {
    try {
      const despesaSnapshot = await colecaoDespesas.get();
      const despesas = despesaSnapshot.docs.map((despesa) => {
        const dataTimestamp = despesa.data().data;

        // Verificar se a data está no formato DD-MM-YYYY
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataTimestamp)) {
          return res.status(400).json({ erro: 'Formato de data inválido. Use YYYY-MM-DD.' });
        }

        const [ano, mes, dia] = dataTimestamp.split('-');

        // Converter a data para o formato DD-MM-YYYY
        const dataFormatada = `${dia}-${mes}-${ano}`;

        console.log('Data formatada:', dataFormatada);

        return {
          id: despesa.id,
          ...despesa.data(),
          data: dataFormatada, // Formato DD-MM-YYYY
      }});

      if (despesas.length === 0) {
        return res.status(404).json({ message: 'Nenhuma despesa encontrada' });
      }

      return res.status(200).json(despesas);
    } catch (erro) {
      console.error(erro); // Log do erro para depuração
      return res.status(500).json({ erro: "Falha ao listar despesas" });
    }
  }

  static async editarDespesa(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dados: Despesas = req.body;

      // Verificar se a data está no formato DD-MM-YYYY
      if (!/^\d{2}-\d{2}-\d{4}$/.test(dados.data)) {
        return res.status(400).json({ erro: 'Formato de data inválido. Use DD-MM-YYYY.' });
      }

      const [dia, mes, ano] = dados.data.split('-');

      // Verifica se o ano é válido (ex: 1900 - 2100)
      const anoNumero = parseInt(ano, 10);
      if (anoNumero < 1900 || anoNumero > 2100) {
        return res.status(400).json({ erro: 'Ano deve estar entre 1900 e 2100.' });
      }

      // Converter a data para o formato YYYY-MM-DD para salvar no Firestore
      const dataFormatada = `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD

      // Verifica se a categoria existe
      const categoriaId = String(dados.categoriaId); // Converter para string
      if (!categoriaId) {
        return res.status(400).json({ erro: "ID da categoria é obrigatório." });
      }

      const categoriaDoc = await colecaoCategorias.doc(categoriaId).get();
      if (!categoriaDoc.exists) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }

      // Atualizar despesa
      await colecaoDespesas.doc(id).update({
        nome: dados.nome,
        categoriaId: categoriaId, // Agora é uma string
        valor: dados.valor,
        data: dataFormatada,
        descricao: dados.descricao,
      });

      return res.status(200).json({ id, ...dados });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Falha ao editar despesa" });
    }
  }
}
