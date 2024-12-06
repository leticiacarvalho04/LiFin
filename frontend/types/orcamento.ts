import { GastosFixos } from "./gastosFixos";

export interface Orcamento {
    id: number,
    nome: string,
    renda_fixa: number,
    renda_extra: number;
    porcentagem: string;
    data: Date,
    gastosFixos: [GastosFixos];
}