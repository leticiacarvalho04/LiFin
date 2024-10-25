// types/express/index.d.ts
import { User } from "firebase/auth"; 

declare global {
  namespace Express {
    interface Request {
      user?: User; // Ou use o tipo correto do seu usuário
    }
  }
}
