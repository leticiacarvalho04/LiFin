import { GastosFixos } from "./gastosFixos";

export interface Orcamento {
    id: number,
    nome: string,
    renda_fixa: string,
    renda_extra: string;
    data: Date,
    gastosFixos: GastosFixos;
}