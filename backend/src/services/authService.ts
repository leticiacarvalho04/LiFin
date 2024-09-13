import { auth } from "../config";

export const signUp = async (email: string, password: string) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar usuário:", error.message);
    } else {
      console.error("Erro ao criar usuário:", error);
    }
  }
};

    export const signIn = async (email: string, password: string) => {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao autenticar usuário:", error.message);
        } else {
          console.error("Erro ao autenticar usuário:", error);
        }
      }
    };

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao sair:", error.message);
    } else {
      console.error("Erro ao sair:", error);
    }
  }
};
