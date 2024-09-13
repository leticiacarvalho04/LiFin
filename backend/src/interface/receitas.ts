import Categoria from "./categoria";

export default interface Receitas {
    id: number;
    nome: string;
    categoria: Categoria;
    valor: number;
    data: Date;
    descricao: string;
    created_at: Date;
    updated_at: Date;
}