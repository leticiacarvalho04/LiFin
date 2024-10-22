import { Usuario } from './../interface/usuario';
import { Request, Response } from "express";
import { db, auth } from '../config'; // Certifique-se de que está importando o auth do Firebase Admin
import { AuthenticatedRequest } from '../middleware/autenticarToken';

const colecaoUsuario = db.collection('usuarios');

export default class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response) {
        const { nome, email, senha } = req.body;

        try {
            // Cria um novo usuário no Firebase Authentication usando o Firebase Admin SDK
            const userRecord = await auth.createUser({
                email,
                password: senha,
                displayName: nome,
            });

            // Salva os dados do usuário no Firestore
            const usuario = await colecaoUsuario.doc(userRecord.uid).set({ nome, email, senha, uid: userRecord.uid });

            return res.status(201).json({ id: usuario, nome, email, uid: userRecord.uid });
        } catch (error) {
            // Retorna um erro se o registro falhar
            console.error("Erro ao cadastrar usuário:", error);
            return res.status(400).json({ erro: (error as Error).message });
        }
    }

    static async listarUsuarioPorId(req: AuthenticatedRequest, res: Response) {
        // Verifica se o usuário está autenticado
        if (!req.usuarioAutenticado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        try {
            // Pega os dados do Firestore
            const usuarioSnapshot = await colecaoUsuario.doc(req.usuarioAutenticado.uid).get();
            const usuarioData = usuarioSnapshot.data();
            if (usuarioData) {
                return res.json({
                    uid: usuarioData.uid,
                    nome: usuarioData.nome,
                    email: usuarioData.email,
                    senha: usuarioData.senha // Agora você pode retornar a senha armazenada
                });
            } else {
                return res.status(404).json({ erro: "Usuário não encontrado" });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário no Firestore:", error);
            return res.status(500).json({ erro: "Erro ao buscar dados do usuário" });
        }
    }

    static async atualizarUsuario(req: AuthenticatedRequest, res: Response) {
        // Verifica se o usuário está autenticado
        if (!req.usuarioAutenticado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        const { nome, email, senha } = req.body;

        try {
            // Atualiza os dados do usuário no Firestore
            const usuario = await colecaoUsuario.doc(req.usuarioAutenticado.uid).update({ nome, email, senha });

            return res.json({ id: usuario, nome, email, senha });
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            return res.status(400).json({ erro: (error as Error).message });
        }
    }

    static async deletarUsuario(req: AuthenticatedRequest, res: Response) {
        // Verifica se o usuário está autenticado
        if (!req.usuarioAutenticado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        try {
            // Deleta o usuário do Firebase Authentication
            await auth.deleteUser(req.usuarioAutenticado.uid);

            // Deleta o usuário do Firestore
            await colecaoUsuario.doc(req.usuarioAutenticado.uid).delete();

            return res.json({ mensagem: "Usuário deletado com sucesso" });
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            return res.status(400).json({ erro: (error as Error).message });
        }
    }
}
