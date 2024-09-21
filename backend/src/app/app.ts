import express from "express";
import dotenv from "dotenv";
import router from "../routes";

dotenv.config();

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*', // Permite qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

app.use(router); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
