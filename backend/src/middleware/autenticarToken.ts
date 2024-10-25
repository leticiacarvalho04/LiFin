import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from './../interface/usuario';

const JWT_SECRET = "lifin203031"; // Deve ser o mesmo usado no AuthController

// Extendendo o tipo Request para incluir `usuarioAutenticado` como `Usuario`
export interface AuthenticatedRequest extends Request {
    usuarioAutenticado?: Usuario;
}

export const autenticarToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Assumindo que o token seja passado como 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    try {
        // Decodifica o token JWT
        const decoded = jwt.verify(token, JWT_SECRET) as { uid: string; email: string };
        
        // Atribui o uid e email ao campo `usuarioAutenticado`
        req.usuarioAutenticado = {
            uid: decoded.uid,
            email: decoded.email,
        };

        next();
    } catch (err) {
        res.status(403).json({ erro: "Token inválido." });
    }
};
