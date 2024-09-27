import Categoria from "./categoria";

export default interface Receitas {
    id?: string; // ID gerado pelo Firestore
    nome: string;
    categoriaId: string; // Alterado para string, representando o ID da categoria
    valor: number;
    data: string; // Firestore armazena datas como strings ISO
    descricao: string;
    created_at: string; // Firestore usa strings ISO para datas
    updated_at: string; // Firestore usa strings ISO para datas
}