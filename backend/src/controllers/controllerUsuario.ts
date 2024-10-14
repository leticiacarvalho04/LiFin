import { Usuario } from './../interface/usuario';
import { Request, Response } from "express";
import { db, auth } from '../config'; // Certifique-se de que está importando o auth do Firebase Admin

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
            const usuario = await colecaoUsuario.add({ nome, email, uid: userRecord.uid });

            return res.status(201).json({ id: usuario.id, nome, email, uid: userRecord.uid });
        } catch (error) {
            // Retorna um erro se o registro falhar
            console.error("Erro ao cadastrar usuário:", error);
            return res.status(400).json({ erro: (error as Error).message });
        }
    }

    static async listarUsuario(req: Request, res: Response) {
        const usuarios: Usuario[] = [];
        const snapshot = await colecaoUsuario.get();
        snapshot.forEach((doc) => {
            const { email, nome } = doc.data();
            usuarios.push({
                uid: doc.id, email, nome,
                senha: '' // É melhor evitar retornar a senha, mesmo que esteja vazia
            });
        });
        return res.json(usuarios);
    }

    static async listarUsuarioPorId(req: Request, res: Response) {
        const { id } = req.params;
        const usuario = await colecaoUsuario.doc(id).get();
        if (!usuario.exists) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        const { email, nome } = usuario.data() as Usuario;
        return res.json({ id: usuario.id, email, nome });
    }
}
