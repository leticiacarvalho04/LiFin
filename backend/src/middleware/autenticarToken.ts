import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Substitua pelo seu segredo forte, e considere movê-lo para um arquivo de ambiente
const JWT_SECRET = process.env.JWT_SECRET || "lifin203031"; // Melhor prática é usar variáveis de ambiente

// Extensão da interface Request para incluir a propriedade user
interface CustomRequest extends Request {
    user?: any; // ou defina um tipo mais específico se você tiver um
}

export function autenticarToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Assume que o token vem no formato "Bearer token"

    if (!token) {
        return res.status(403).json({ erro: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário ao request
        next();
    } catch (error) {
        return res.status(401).json({ erro: "Token inválido" });
    }
}
