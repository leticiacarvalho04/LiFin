import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/autenticarToken";
import { db } from "../config";
import { Orcamento } from "../interface/orcamento";

const colecaoOrcamento = db.collection("orcamento");

export class ControllerOrcamento {
    static async cadastrarOrcamento(req: AuthenticatedRequest, res: Response){
        try{
            const dados: Orcamento = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Verifica se a categoria existe
            const gastosFixosId = String(dados.gastosFixosId); // Converter para string
            if (!gastosFixosId) {
                return res.status(400).json({ erro: "ID do gasto fixo é obrigatório." });
            }

            // Adicionando o ID do usuário logado na categoria
            const userId = req.usuarioAutenticado.uid; // O middleware de autenticação já inseriu o uid em req.usuarioAutenticado
            const novoOrcamento = await colecaoOrcamento.add({
                ...dados,
                userId // Vincula o id do usuário logado a esta categoria
            });

            const { id, ...dadosSemId } = dados;
            res.status(201).json({ id: novoOrcamento.id, ...dadosSemId });
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao cadastrar orçamento" });
        }
    }

    static async listarOrcamento(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const orcamentoSnapshot = await colecaoOrcamento
                .where("userId", "==", req.usuarioAutenticado.uid) // Filtra categorias por ID do usuário autenticado
                .get();

            const orcamento = orcamentoSnapshot.docs.map(doc => ({
                id: doc.id, // ID gerado pelo Firestore
                ...doc.data()
            }));

            return res.status(200).json(orcamento);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar orçamento" });
        }
    }
}