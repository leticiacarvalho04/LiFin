import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/autenticarToken";
import { GastosFixos } from "../interface/gastosFixos";
import { db } from "../config";

const colecaoGastosFixos = db.collection("gastosFixos");

export class ControllerGastosFixos {
    static async cadastrarGastosFixos(req: AuthenticatedRequest, res: Response){
        try {
            const dados: GastosFixos = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Adicionando o ID do usuário logado na categoria
            const userId = req.usuarioAutenticado.uid; // O middleware de autenticação já inseriu o uid em req.usuarioAutenticado
            const novoGastoFixo = await colecaoGastosFixos.add({
                ...dados,
                userId // Vincula o id do usuário logado a esta categoria
            });

            const { id, ...dadosSemId } = dados;
            res.status(201).json({ id: novoGastoFixo.id, ...dadosSemId });
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao cadastrar gastos fixos" });
        }
    }

    static async listarGastosFixos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const gastosFixosSnapshot = await colecaoGastosFixos
                .where("userId", "==", req.usuarioAutenticado.uid) // Filtra categorias por ID do usuário autenticado
                .get();

            const gastosFixos = gastosFixosSnapshot.docs.map(doc => ({
                id: doc.id, // ID gerado pelo Firestore
                ...doc.data() as Omit<GastosFixos, 'id'>
            }));

            return res.status(200).json(gastosFixos);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar gastos fixos" });
        }
    }

    static async atualizarGastosFixos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const dados: GastosFixos = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Verifica se o gasto fixo pertence ao usuário autenticado
            const gastoFixo = await colecaoGastosFixos.doc(id).get();
            if (!gastoFixo.exists) {
                return res.status(404).json({ erro: "Gasto fixo não encontrado" });
            }

            if (gastoFixo.data()?.userId !== req.usuarioAutenticado.uid) {
                return res.status(403).json({ erro: "Usuário não autorizado" });
            }

            await colecaoGastosFixos.doc(id).update({ ...dados });
            return res.status(200).json({ id, ...dados });
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao atualizar gastos fixos" });
        }
    }

    static async deletarGastosFixos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Verifica se o gasto fixo pertence ao usuário autenticado
            const gastoFixo = await colecaoGastosFixos.doc(id).get();
            if (!gastoFixo.exists) {
                return res.status(404).json({ erro: "Gasto fixo não encontrado" });
            }

            if (gastoFixo.data()?.userId !== req.usuarioAutenticado.uid) {
                return res.status(403).json({ erro: "Usuário não autorizado" });
            }

            await colecaoGastosFixos.doc(id).delete();
            return res.status(200).json({ id });
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao deletar gastos fixos" });
        }
    }
}