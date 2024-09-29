import { Request, Response } from "express";
import { db } from "../config";
import Receitas from "../interface/receitas";

const colecaoReceitas = db.collection("receitas");
const colecaoCategorias = db.collection("categorias");

export default class ReceitaController {
    static async cadastrarReceita(req: Request, res: Response) {
        try {
          const dados: Receitas = req.body; // Dados da despesa recebidos no corpo da requisição
      
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
        console.log(`Verificando categoria com ID: ${req.body.categoriaId}`);

        // Verifica se a categoria existe
        const categoriaId = String(dados.categoriaId); // Converter para string
        if (!categoriaId) {
            return res.status(400).json({ erro: "ID da categoria é obrigatório." });
        }

        const categoriaDoc = await colecaoCategorias.doc(categoriaId).get();
        if (!categoriaDoc.exists) {
            return res.status(400).json({ erro: "Categoria não encontrada" });
        }
      
          // Gerar um novo ID para a receita
          const novaReceitaRef = colecaoReceitas.doc();
          const novaReceitaId = novaReceitaRef.id;

          // Adicionar a receita à coleção 'receitas' com o ID gerado
          await novaReceitaRef.set({
            id: novaReceitaId,
            nome: dados.nome,
            categoriaId: dados.categoriaId, // Associar pelo ID da categoria
            valor: dados.valor,
            data: dataFormatada, // Armazenar a data como objeto Date
            descricao: dados.descricao,
          });

          // Retorna o ID e os dados cadastrados
        const { id, ...dadosSemId } = dados;
          res.status(201).json({ id: novaReceitaId, ...dadosSemId }); // Retorna o ID da nova receita e os dados cadastrados
        } catch (erro) {
          res.status(500).json({ erro: "Falha ao cadastrar receita" }); // Trata erros
        }
      };

      static async listarReceita (req: Request, res: Response) {
        try{
          const receitaSnapshot = await colecaoReceitas.get();

          const receitas = receitaSnapshot.docs.map((receita) => {
              const dataTimestamp = receita.data().data; // Supondo que 'data' seja o campo do timestamp
      
             // Verificar se a data está no formato correto (YYYY-MM-DD)
          if (typeof dataTimestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataTimestamp)) {
            console.error(`Data inválida encontrada: ${dataTimestamp}`);
            // Neste caso, continue com a próxima despesa
            return null;
          }
    
          const [ano, mes, dia] = dataTimestamp.split('-');
          const dataFormatada = `${dia}-${mes}-${ano}`; // Formato DD-MM-YYYY
    
      
              return {
                  id: receita.id,
                  ...receita.data() as Omit<Receitas, 'id'>,
                  data: dataFormatada,
              };
          }).filter(receita => receita !== null);
      
          return res.status(200).json(receitas);
        } catch (erro) {
          console.error(erro); // Log do erro para depuração
          return res.status(500).json({ erro: "Falha ao listar despesas" });
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