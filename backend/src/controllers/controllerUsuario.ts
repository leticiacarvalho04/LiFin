import { db } from '../config';
import { Usuario } from './../interface/usuario';
import { Request, Response } from "express";

const colecaoUsuario = db.collection('usuarios');

export default class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response) {
        const { email, senha, nome } = req.body;
        const usuario = await colecaoUsuario.add({ email, senha, nome });
        return res.json(usuario);
    }

    static async listarUsuario(req: Request, res: Response) {
        const usuarios: Usuario[] = [];
        const snapshot = await colecaoUsuario.get();
        snapshot.forEach((doc) => {
            const { email, senha, nome } = doc.data();
            usuarios.push({ id: doc.id, email, senha, nome });
        });
        return res.json(usuarios);
    }

    static async listarUsuarioPorId(req: Request, res: Response) {
        const { id } = req.params;
        const usuario = await colecaoUsuario.doc(id).get();
        if (!usuario.exists) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }
        const { email, senha, nome } = usuario.data() as Usuario;
        return res.json({ id: usuario.id, email, senha, nome });
    }
}