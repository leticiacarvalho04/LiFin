import { Request, Response } from "express";
import { db } from "../config"; // Importa a configuração do Firebase
import Despesas from "../interface/despesas"; // Importa a interface Despesas
import { AuthenticatedRequest } from "../middleware/autenticarToken";

const colecaoDespesas = db.collection("despesas");
const colecaoCategorias = db.collection("categoriaDespesa");

export default class DespesaController {
  
  // Cadastrar Despesa
  static async cadastrarDespesa(req: AuthenticatedRequest, res: Response) {
    try {
      const dados: Despesas = req.body;

      // Verifica se o usuário está autenticado
      if (!req.usuarioAutenticado) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

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
      const dataFormatada = `${ano}-${mes}-${dia}`;

      // Verifica se a categoria existe
      const categoriaId = String(dados.categoriaId); // Converter para string
      if (!categoriaId) {
        return res.status(400).json({ erro: "ID da categoria é obrigatório." });
      }

      const categoriaDoc = await colecaoCategorias.doc(categoriaId).get();
      if (!categoriaDoc.exists) {
        return res.status(400).json({ erro: "Categoria não encontrada" });
      }

      // Adicionando o ID do usuário logado na categoria
      const userId = req.usuarioAutenticado.uid; 

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
        userId: userId,
      });

      return res.status(201).json({ id: novaDespesaId, ...dados });
    } catch (erro) {
      console.error("Erro ao cadastrar despesa:", erro);
      return res.status(500).json({ erro: "Falha ao cadastrar despesa" });
    }
  }

  // Listar Despesas
  static async listarDespesas(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.usuarioAutenticado) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const despesaSnapshot = await colecaoDespesas
        .where("userId", "==", req.usuarioAutenticado.uid)
        .get();
  
      const despesas = despesaSnapshot.docs.map((despesa) => {
        const dataDespesa = despesa.data().data;
  
        // Verificar se a data está no formato correto (YYYY-MM-DD)
        if (typeof dataDespesa !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataDespesa)) {
          console.error(`Data inválida encontrada: ${dataDespesa}`);
          return null;
        }
  
        const [ano, mes, dia] = dataDespesa.split('-');
        const dataFormatada = `${dia}-${mes}-${ano}`;
  
        return {
          id: despesa.id,
          ...despesa.data(),
          data: dataFormatada, 
        };
      }).filter(despesa => despesa !== null);
  
      return res.status(200).json(despesas);
    } catch (erro) {
      console.error("Erro ao listar despesas:", erro);
      return res.status(500).json({ erro: "Falha ao listar despesas" });
    }
  }
  
  // Atualizar Despesa
  static async atualizarDespesa(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const despesaAtualizada: Partial<Despesas> = req.body;

      if (!req.usuarioAutenticado) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const despesaSnapshot = await colecaoDespesas.doc(id).get();
      if (!despesaSnapshot.exists) {
        return res.status(404).json({ erro: "Despesa não encontrada" });
      }

      const despesaData = despesaSnapshot.data();
      if (despesaData?.userId !== req.usuarioAutenticado.uid) {
        return res.status(403).json({ erro: "Acesso negado. Esta despesa não pertence a você." });
      }
    
      await colecaoDespesas.doc(id).update(despesaAtualizada);
      res.json({ message: 'Despesa atualizada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar despesa', error });
    }
  }

  // Deletar Despesa
  static async deletarDespesa(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      if (!req.usuarioAutenticado) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const despesaSnapshot = await colecaoDespesas.doc(id).get();
      if (!despesaSnapshot.exists) {
        return res.status(404).json({ erro: "Despesa não encontrada" });
      }

      const despesaData = despesaSnapshot.data();
      if (despesaData?.userId !== req.usuarioAutenticado.uid) {
        return res.status(403).json({ erro: "Acesso negado. Esta despesa não pertence a você." });
      }

      await colecaoDespesas.doc(id).delete();
      return res.json({ message: 'Despesa deletada com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar despesa', error });
    }
  }
}
