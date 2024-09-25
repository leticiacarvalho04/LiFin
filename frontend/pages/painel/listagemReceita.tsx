import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Receitas } from "../../types/receitas";
import { Categoria } from "../../types/categoria";
import { API_URL } from "../../api";
import Dropdown from "../../components/dropdown";

export default function ListagemReceitas() {
    const [painelValues, setPainelValues] = useState<Receitas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${API_URL}/categorias`);
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await axios.get(`${API_URL}/receitas`);
                const receitasData = response.data.map((receita: Receitas): Receitas => ({
                    nome: receita.nome,
                    valor: receita.valor.toString(), // Valor convertido para string
                    categoriaId: receita.categoriaId,
                    data: receita.data.split(" às ")[0],
                    descricao: receita.descricao,
                    created_at: receita.created_at,
                    updated_at: receita.updated_at,
                }));

                setPainelValues(receitasData);
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
            }
        };

        fetchCategorias();
        fetchReceitas();
    }, []);

    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria desconhecida";
    };

    return (
        <View style={styles.container}>
            {painelValues.map((receita: Receitas, index: number) => (
                <Dropdown 
                    key={index} 
                    title={receita.nome} 
                    date={receita.data} 
                    value={receita.valor} 
                    valueColor="#2e7d32"  
                >
                    <Text>Categoria: {getCategoriaNome(receita.categoriaId)}</Text>
                    <Text>Descrição: {receita.descricao}</Text>
                    <Text>Criado em: {receita.created_at}</Text>
                    <Text>Atualizado em: {receita.updated_at}</Text>
                </Dropdown>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
});
