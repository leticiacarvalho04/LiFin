import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/autenticarToken";
import { db } from "../config";
import { Orcamento } from "../interface/orcamento";

const colecaoOrcamento = db.collection("orcamento");

export class ControllerOrcamento {
    static async cadastrarOrcamento(req: AuthenticatedRequest, res: Response) {
        try {
            const dados: Orcamento = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Verifica se os IDs dos gastos fixos foram fornecidos
            if (!dados.gastosFixosId || !dados.gastosFixosId.length) {
                return res.status(400).json({ erro: "IDs de gastos fixos são obrigatórios." });
            }

            // Adiciona o ID do usuário logado
            const userId = req.usuarioAutenticado.uid;

            // Calcula o valor total, incluindo renda extra, se houver
            const total = dados.valorTotal + (dados.rendaExtra || 0);

            // Calcula a porcentagem da renda extra no total
            const porcentagem = (((dados.rendaExtra || 0) * 100) / total).toFixed(2);

            // Busca os gastos fixos no Firestore
            const gastosSnapshot = await Promise.all(
                dados.gastosFixosId.map(async (id) => {
                    const doc = await db.collection("gastosFixos").doc(id).get();
                    return doc.exists ? { id: doc.id, ...(doc.data() as { nome: string; valor: number }) } : null;
                })
            );

            // Filtra os gastos válidos e calcula suas porcentagens
            const gastosFixosPorcentagem = gastosSnapshot
            .filter((gasto) => gasto) // Remove itens nulos
            .map((gasto) => {
                if (!gasto) return null; // Verificação extra, embora o filtro já remova nulos
                const porcentagemGasto = ((gasto.valor * 100) / total).toFixed(2);
                return porcentagemGasto
            })
            .filter((item) => item !== null); 

            // Grava o orçamento no Firestore
            await colecaoOrcamento.add({
                total,
                userId,
                gastosFixosId: dados.gastosFixosId,
                valorTotal: dados.valorTotal,
                rendaExtra: dados.rendaExtra,
                gastosFixosPorcentagem,
                porcentagem,
            });

            // Envia resposta com o orçamento registrado
            res.status(201).json({ ...dados, total, userId, porcentagem, gastosFixosPorcentagem });
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

            // Busca orçamentos do usuário autenticado
            const orcamentoSnapshot = await colecaoOrcamento
                .where("userId", "==", req.usuarioAutenticado.uid)
                .get();

            const orcamento = orcamentoSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return res.status(200).json(orcamento);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar orçamentos" });
        }
    }

    static async atualizarOrcamento(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const dados: Orcamento = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Verifica se os IDs dos gastos fixos foram fornecidos
            if (!dados.gastosFixosId || !dados.gastosFixosId.length) {
                return res.status(400).json({ erro: "IDs de gastos fixos são obrigatórios." });
            }

            // Calcula o valor total, incluindo renda extra, se houver
            const total = dados.valorTotal + (dados.rendaExtra || 0);

            // Calcula a porcentagem da renda extra no total
            const porcentagem = (((dados.rendaExtra || 0) * 100) / total).toFixed(2);

            // Busca os gastos fixos no Firestore
            const gastosSnapshot = await Promise.all(
                dados.gastosFixosId.map(async (id) => {
                    const doc = await db.collection("gastosFixos").doc(id).get();
                    return doc.exists ? { id: doc.id, ...(doc.data() as { nome: string; valor: number }) } : null;
                })
            );

            // Filtra os gastos válidos e calcula suas porcentagens
            const gastosFixosPorcentagem = gastosSnapshot
            .filter((gasto) => gasto) // Remove itens nulos
            .map((gasto) => {
                if (!gasto) return null; // Verificação extra, embora o filtro já remova nulos
                const porcentagemGasto = ((gasto.valor * 100) / total).toFixed(2);
                return porcentagemGasto
            })
            .filter((item) => item !== null); 

            // Atualiza o orçamento no Firestore
            await colecaoOrcamento.doc(id).update({
                total,
                userId: req.usuarioAutenticado.uid,
                gastosFixosId: dados.gastosFixosId,
                valorTotal: dados.valorTotal,
                rendaExtra: dados.rendaExtra,
                gastosFixosPorcentagem,
                porcentagem,
            });

            // Envia resposta com o orçamento atualizado
            return res.status(200).json({ ...dados, total, userId: req.usuarioAutenticado.uid, porcentagem,gastosFixosPorcentagem });
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao atualizar orçamento" });
        }
    }

    static async deletarOrcamento(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            // Deleta o orçamento no Firestore
            await colecaoOrcamento.doc(id).delete();

            // Envia resposta com o orçamento deletado
            return res.status(200).json({ id });
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao deletar orçamento" });
        }
    }
}
