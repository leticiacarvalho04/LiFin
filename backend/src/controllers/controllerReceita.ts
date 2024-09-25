import { Request, Response } from "express";
import { db } from "../config";
import Receitas from "../interface/receitas";

const colecaoReceitas = db.collection("receitas");
const colecaoCategorias = db.collection("categorias");

export default class ReceitaController {
    static async cadastrarReceita(req: Request, res: Response) {
        try {
          const dados: Receitas = req.body; // Dados da despesa recebidos no corpo da requisição
      
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
          const datareceita = parseDate(dados.data);
      
          // Adicionar a receita à coleção 'receitas'
          const novaReceita = await colecaoReceitas.add({
            nome: dados.nome,
            categoriaId: dados.categoriaId, // Associar pelo ID da categoria
            valor: dados.valor,
            data: datareceita, // Armazenar a data como objeto Date
            descricao: dados.descricao,
            created_at: new Date(), // Definir data de criação atual
            updated_at: new Date(), // Definir data de atualização atual
          });
      
          res.status(201).json({ id: novaReceita.id, ...dados }); // Retorna o ID da nova receita e os dados cadastrados
        } catch (erro) {
          res.status(500).json({ erro: "Falha ao cadastrar receita" }); // Trata erros
        }
      };

      static async listarReceita (req: Request, res: Response) {
        const receitaSnapshot = await colecaoReceitas.get();
        const receitas = receitaSnapshot.docs.map((receita) => {
            const dataTimestamp = receita.data().data; // Supondo que 'data' seja o campo do timestamp
    
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
                id: receita.id,
                ...receita.data() as Omit<Receitas, 'id'>,
                data: formattedDate, // A data agora está formatada
                updated_at: receita.data().updated_at.toDate().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
                created_at: receita.data().created_at.toDate().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            };
        });
    
        if (receitas.length === 0) {
            return res.status(404).json({ message: 'Receita não encontrada' });
        }
    
        return res.status(200).json(receitas);
    }
}