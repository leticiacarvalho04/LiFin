import { Request, Response } from "express";
import { db } from "../config";
import Despesas from "../interface/despesas";

const colecaoDespesas = db.collection("despesas");

export async function listarDespesa(req: Request, res: Response) {
    const despesaSnapshot = await colecaoDespesas.get();
    const despesas = despesaSnapshot.docs.map((despesa) => {
        const dataTimestamp = despesa.data().data; // Supondo que 'data' seja o campo do timestamp

        // Converte o timestamp em uma data legível
        const formattedDate = dataTimestamp.toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            // Não especificando timeZone aqui
        });

        return {
            id: despesa.id,
            ...despesa.data() as Omit<Despesas, 'id'>,
            data: formattedDate, // A data agora está formatada
            updated_at: despesa.data().updated_at.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                // Não especificando timeZone aqui
            }),
            created_at: despesa.data().created_at.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                // Não especificando timeZone aqui
            }),
            
        };
    });

    if (despesas.length === 0) {
        return res.status(404).json({ message: 'Despesa não encontrada' });
    }

    return res.status(200).json(despesas);
}
