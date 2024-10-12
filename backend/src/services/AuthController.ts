import { Request, Response } from "express";
import { auth } from "../config"; // Certifique-se de que este é o Firebase Admin SDK
import jwt from "jsonwebtoken";

const JWT_SECRET = "lifin203031"; // Coloque uma chave secreta forte aqui

export default class AuthController {
    static async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        try {
            // Verifica se o usuário existe
            const userRecord = await auth.getUserByEmail(email);

            // Aqui você precisa de um método para verificar a senha
            // Se você não tiver um, precisará implementar a autenticação com o Firebase no frontend
            // Por exemplo, você pode usar o Firebase Authentication para autenticar no frontend e então enviar o token para o backend

            // Caso a autenticação seja bem-sucedida, você pode criar um token JWT
            const token = jwt.sign({ uid: userRecord.uid, email: userRecord.email }, JWT_SECRET, {
                expiresIn: "1h",
            });

            // Retornando o ID do usuário e o token
            return res.status(200).json({ uid: userRecord.uid, token });
        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(401).json({ erro: "Falha no login" });
        }
    }
}
