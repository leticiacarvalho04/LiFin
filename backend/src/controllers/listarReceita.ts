import { Request, Response } from "express";
import { db } from "../config";
import Receitas from "../interface/receitas";

const colecaoReceitas = db.collection("receitas");

export async function listarReceita(req: Request, res: Response) {
    const receitaSnapshot = await colecaoReceitas.get();
    const receitas = receitaSnapshot.docs.map((receita) => {
        const dataTimestamp = receita.data().data; // Supondo que 'data' seja o campo do timestamp

        // Converte o timestamp em uma data legível
        const formattedDate = dataTimestamp.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        return {
            id: receita.id,
            ...receita.data() as Omit<Receitas, 'id'>,
            data: formattedDate, // A data agora está formatada
            updated_at: receita.data().updated_at.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
            created_at: receita.data().created_at.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
        };
    });

    if (receitas.length === 0) {
        return res.status(404).json({ message: 'Receita não encontrada' });
    }

    return res.status(200).json(receitas);
}
