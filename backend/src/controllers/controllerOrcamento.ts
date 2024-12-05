import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/autenticarToken";
import { db } from "../config";
import { Orcamento } from "../interface/orcamento";
import Despesas from "../interface/despesas";
import Receitas from "../interface/receitas";
import { GastosFixos } from "../interface/gastosFixos";

const colecaoOrcamento = db.collection("orcamento");
const colecaoDespesas = db.collection("despesas");
const colecaoReceitas = db.collection("receitas");
const colecaoGastosFixos = db.collection('gastosFixos');

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
                gastosFixos: gastosSnapshot.filter((gasto) => gasto !== null),
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
                gastosFixos: doc.data().gastosFixos || [],
            }));

            return res.status(200).json(orcamento);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar orçamentos" });
        }
    }

    static async listarGraficoRenda(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }
    
            const userId = req.usuarioAutenticado.uid;
    
            // Função utilitária para converter valores no formato brasileiro para números
            const parseValor = (valor: string): number => {
                return parseFloat(valor.replace(/\./g, "").replace(",", "."));
            };
    
            // Busca todas as despesas do usuário
            const despesasSnapshot = await colecaoDespesas.where("userId", "==", userId).get();
            const totalDespesas = despesasSnapshot.docs.reduce((total, doc) => {
                const despesa = doc.data() as Despesas;
                const valor = parseValor(despesa.valor); // Converte para número
                return total + valor;
            }, 0);
    
            // Busca todas as receitas do usuário
            const receitasSnapshot = await colecaoReceitas.where("usuarioId", "==", userId).get();
            const totalReceitas = receitasSnapshot.docs.reduce((total, doc) => {
                const receita = doc.data() as Receitas;
                const valor = parseValor(receita.valor); // Converte para número
                return total + valor;
            }, 0);
    
            console.log("Total despesas:", totalDespesas);
            console.log("Total receitas:", totalReceitas);
    
            // Calcula a porcentagem com base no menor valor em relação ao maior
            let porcentagem = 0;
            if (totalDespesas > 0 && totalReceitas > 0) {
                const menorValor = Math.min(totalDespesas, totalReceitas);
                const maiorValor = Math.max(totalDespesas, totalReceitas);
                porcentagem = (menorValor * 100) / maiorValor;
            }
    
            // Retorna os resultados
            return res.status(200).json({
                totalDespesas,
                totalReceitas,
                porcentagem,
            });
        } catch (erro) {
            console.error("Erro ao listar gráfico de renda:", erro);
            return res.status(500).json({ erro: "Falha ao calcular dados do gráfico de renda" });
        }
    }
    
    static async listarGraficoGastosFixos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }
    
            const userId = req.usuarioAutenticado.uid;
    
            // Busca os orçamentos do usuário autenticado
            const orcamentoSnapshot = await colecaoOrcamento
                .where("userId", "==", userId)
                .get();
    
            if (orcamentoSnapshot.empty) {
                return res.status(404).json({ erro: "Nenhum orçamento encontrado." });
            }
    
            // Itera sobre todos os orçamentos encontrados
            const orcamentosComGastosFixos = await Promise.all(
                orcamentoSnapshot.docs.map(async (orcamentoDoc) => {
                    const orcamento = orcamentoDoc.data() as Orcamento;
                    console.log('Orçamento:', orcamento);
    
                    // Verifica se gastosFixosId é um array
                    if (!Array.isArray(orcamento.gastosFixosId)) {
                        return null; // Ignora orçamentos com dados de gastos fixos inválidos
                    }
                    console.log("Gastos fixos:", orcamento.gastosFixosId);
    
                    // Busca os gastos fixos associados ao orçamento
                    const gastosFixosDocs = await Promise.all(
                        orcamento.gastosFixosId.map(async (id) => {
                            const gastoDoc = await colecaoGastosFixos.doc(id).get();
                            return gastoDoc.exists ? { id: gastoDoc.id, ...(gastoDoc.data() as GastosFixos) } : null;
                        })
                    );
    
                    // Filtra os gastos válidos
                    const gastosFixos = gastosFixosDocs.filter((gasto) => gasto !== null) as GastosFixos[];
    
                    if (gastosFixos.length === 0) {
                        return null; // Ignora orçamentos sem gastos fixos
                    }
    
                    // Calcula o total dos gastos fixos
                    const totalGastosFixos = gastosFixos.reduce((total, gasto) => total + gasto.valor, 0);
    
                    // Calcula a porcentagem de cada gasto fixo
                    const porcentagens = gastosFixos.map((gasto) => ({
                        id: gasto.id,
                        nome: gasto.nome,
                        valor: gasto.valor,
                        porcentagem: ((gasto.valor * 100) / totalGastosFixos).toFixed(2),
                    }));
    
                    return {
                        id: orcamentoDoc.id,
                        nome: orcamento.id,
                        totalGastosFixos,
                        gastosFixos: porcentagens,
                    };
                })
            );
    
            // Filtra orçamentos que não possuem dados válidos
            const orcamentosValidos = orcamentosComGastosFixos.filter((orcamento) => orcamento !== null);
    
            if (orcamentosValidos.length === 0) {
                return res.status(404).json({ erro: "Nenhum orçamento válido encontrado." });
            }
    
            // Retorna os orçamentos com os gastos fixos e porcentagens calculadas
            return res.status(200).json({ orcamentos: orcamentosValidos });
        } catch (erro) {
            console.error("Erro ao listar gráfico de gastos fixos:", erro);
            return res.status(500).json({ erro: "Falha ao listar gráfico de gastos fixos." });
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
                gastosFixos: gastosSnapshot.filter((gasto) => gasto !== null),
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
