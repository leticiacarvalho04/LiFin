import { Categoria } from "./categoria";

export interface Despesas {
    id: number,
    nome: string,
    valor: string,
    categoria: Categoria,
    data: Date,
    descricao: string;
}