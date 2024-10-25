import { Request, Response } from "express";
import { db } from "../config";
import Receitas from "../interface/receitas";
import { AuthenticatedRequest } from "../middleware/autenticarToken";

const colecaoReceitas = db.collection("receitas");
const colecaoCategorias = db.collection("categoriaReceita");

export default class ReceitaController {
  
  static async cadastrarReceita(req: AuthenticatedRequest, res: Response) {
    if (!req.usuarioAutenticado) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    try {
      const dados: Receitas = req.body;

      if (!/^\d{2}-\d{2}-\d{4}$/.test(dados.data)) {
        return res.status(400).json({ erro: 'Formato de data inválido. Use DD-MM-YYYY.' });
      }

      const [dia, mes, ano] = dados.data.split('-');
      const anoNumero = parseInt(ano, 10);

      if (anoNumero < 1900 || anoNumero > 2100) {
        return res.status(400).json({ erro: 'Ano deve estar entre 1900 e 2100.' });
      }

      const dataFormatada = `${ano}-${mes}-${dia}`;

      const categoriaId = String(dados.categoriaId);
      if (!categoriaId) {
        return res.status(400).json({ erro: "ID da categoria é obrigatório." });
      }

      const categoriaDoc = await colecaoCategorias.doc(categoriaId).get();
      if (!categoriaDoc.exists) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }

      const novaReceitaRef = colecaoReceitas.doc();
      const novaReceitaId = novaReceitaRef.id;

      await novaReceitaRef.set({
        id: novaReceitaId,
        nome: dados.nome,
        categoriaId: dados.categoriaId,
        valor: dados.valor,
        data: dataFormatada,
        descricao: dados.descricao,
        usuarioId: req.usuarioAutenticado.uid // Adiciona o ID do usuário autenticado
      });

      const { id, ...dadosSemId } = dados;
      res.status(201).json({ id: novaReceitaId, ...dadosSemId });
    } catch (erro) {
      res.status(500).json({ erro: "Falha ao cadastrar receita" });
    }
  }

  static async listarReceita(req: AuthenticatedRequest, res: Response) {
    if (!req.usuarioAutenticado) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    try {
      const receitaSnapshot = await colecaoReceitas.where('usuarioId', '==', req.usuarioAutenticado.uid).get();
      const receitas = receitaSnapshot.docs.map((receita) => {
        const dataTimestamp = receita.data().data;

        if (typeof dataTimestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataTimestamp)) {
          console.error(`Data inválida encontrada: ${dataTimestamp}`);
          return null;
        }

        const [ano, mes, dia] = dataTimestamp.split('-');
        const dataFormatada = `${dia}-${mes}-${ano}`;

        return {
          id: receita.id,
          ...receita.data() as Omit<Receitas, 'id'>,
          data: dataFormatada,
        };
      }).filter(receita => receita !== null);

      return res.status(200).json(receitas);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: "Falha ao listar receitas" });
    }
  }

  static async atualizarReceita(req: Request, res: Response) {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    try {
      await colecaoReceitas.doc(id).update(dadosAtualizados);
      res.status(200).json({ id, ...dadosAtualizados });
    } catch (erro) {
      console.error("Erro ao editar receita:", erro);
      res.status(500).json({ erro: "Falha ao editar receita" });
    }
  }

  static async deletarReceita(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await colecaoReceitas.doc(id).delete();
      res.status(204).end();
    } catch (erro) {
      res.status(500).json({ erro: "Falha ao excluir receita" });
    }
  }
}