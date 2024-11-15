import { Response } from "express";
import { Meta } from "../interface/meta";
import { AuthenticatedRequest } from "../middleware/autenticarToken";
import { db } from "../config";

const colecaoMetas = db.collection("metas");

export default class ControllerMeta {
    static async cadastrarMeta(req: AuthenticatedRequest, res: Response) {
        try {
            const dados: Meta = req.body;
    
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }
    
            // Adicionando o ID do usuário logado na categoria
            const userId = req.usuarioAutenticado.uid; // O middleware de autenticação já inseriu o uid em req.usuarioAutenticado
            console.log(`Usuário autenticado: ${userId}`);
            
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

            // Calculando a porcentagem com base nos valores
            const porcentagem = (dados.valorAtual / dados.valorTotal) * 100;

            // Aqui você pode usar a porcentagem como necessário, por exemplo, incluí-la na resposta
            console.log(`Porcentagem alcançada: ${porcentagem}%`);
    
            const novoGastoFixo = await colecaoMetas.add({
                ...dados,
                data: dataFormatada,  // Agora a data será salva no formato "YYYY-MM-DD"
                porcentagem, // Adiciona a porcentagem ao documento
                userId // Vincula o id do usuário logado a esta categoria
            });

            console.log(`Meta cadastrada com ID: ${novoGastoFixo.id}`);
    
            const { id, ...dadosSemId } = dados;
            res.status(201).json({ id: novoGastoFixo.id, ...dadosSemId });
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao cadastrar gastos fixos" });
        }
    }    

    static async listarMetas(req: AuthenticatedRequest, res: Response){
        try {
            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const metasSnapshot = await colecaoMetas
                .where("userId", "==", req.usuarioAutenticado.uid) // Filtra categorias por ID do usuário autenticado
                .get();

            const metas = metasSnapshot.docs.map(doc => ({
                id: doc.id, // ID gerado pelo Firestore
                ...doc.data() as Omit<Meta, 'id'>
            }));

            return res.status(200).json(metas);
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao listar gastos fixos" });
        }
    }

    static async atualizarMeta(req: AuthenticatedRequest, res: Response){
        try {
            const { id } = req.params;
            const dados: Meta = req.body;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            const meta = await colecaoMetas.doc(id).get();
            if (!meta.exists) {
                return res.status(404).json({ erro: "Meta não encontrada" });
            }

            await colecaoMetas.doc(id).update({ ...dados });

            return res.status(200).json({ id, ...dados });
        } catch (erro) {
            return res.status(500).json({ erro: "Falha ao atualizar gastos fixos" });
        }
    }

    static async deletarMeta(req: AuthenticatedRequest, res: Response){
        try {
            const { id } = req.params;

            // Verifica se o usuário está autenticado
            if (!req.usuarioAutenticado) {
                return res.status(401).json({ erro: "Usuário não autenticado" });
            }

            await colecaoMetas.doc(id).delete();
            res.status(200).json({ id });
        } catch (erro) {
            console.error("Erro ao deletar meta:", erro);
            res.status(500).json({ erro: "Falha ao deletar meta" });
        }
    }
}