// types/express/index.d.ts
import { User } from "firebase/auth"; // Ou defina seu tipo personalizado de User

declare global {
  namespace Express {
    interface Request {
      user?: User; // Ou use o tipo correto do seu usuário
    }
  }
}
