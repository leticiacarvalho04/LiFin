import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";
import Dropdown from "../../components/dropdown";
import { API_URL } from "../../api";

export default function ListagemDespesas() {
    const [painelValues, setPainelValues] = useState<Despesas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // Função para buscar as categorias
    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${API_URL}/categorias`);
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    useEffect(() => {
        const fetchDespesas = async () => {
            try {
                const response = await axios.get(`${API_URL}/despesas`);
                const despesasData = response.data.map((despesa: Despesas): Despesas => {
                    return {
                        nome: despesa.nome,
                        valor: despesa.valor,
                        categoriaId: despesa.categoriaId,
                        data: despesa.data.split(" às ")[0],
                        descricao: despesa.descricao,
                        created_at: despesa.created_at,
                        updated_at: despesa.updated_at
                    };
                });
                setPainelValues(despesasData);
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            }
        };

        fetchCategorias();
        fetchDespesas();
    }, []);

    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria desconhecida";
    };

    const toggleDropdown = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            {painelValues.map((despesa: Despesas, index: number) => (
                <Dropdown 
                    key={index} 
                    title={despesa.nome} 
                    date={despesa.data} 
                    value={despesa.valor.toString()} // Certifique-se que o valor é uma string
                    valueColor="#d32f2f" 
                >
                    <Text>Categoria: {getCategoriaNome(despesa.categoriaId)}</Text>
                    <Text>Descrição: {despesa.descricao}</Text>
                    <Text>Criado em: {despesa.created_at}</Text>
                    <Text>Atualizado em: {despesa.updated_at}</Text>
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