export default interface Receitas {
    id?: string; // ID gerado pelo Firestore
    nome: string;
    categoriaId: string; // Alterado para string, representando o ID da categoria
    valor: string;
    data: string; // Firestore armazena datas como strings ISO
    descricao: string;
  }