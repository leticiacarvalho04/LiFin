export interface Usuario {
    uid: string;
    email: string;
    nome?: string; // Se houver mais campos, adicione aqui
    senha?: string;
}