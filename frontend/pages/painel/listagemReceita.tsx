import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Receitas } from "../../types/receitas";

export default function ListagemReceitas() {
    const initialValues: Receitas[] = [];
    const [painelValues, setPainelValues] = useState<Receitas[]>(initialValues);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Para controlar qual despesa está expandida

    useEffect(() => {
        const fetchDespesas = async () => {
            try {
                const response = await axios.get('http://192.168.0.14:3000/receitas');
                const despesasData = response.data.map((despesa: Despesas): Despesas => {
                    return {
                        nome: despesa.nome,
                        valor: despesa.valor,
                        categoriaId: despesa.categoriaId,
                        data: despesa.data.split(" às ")[0], // Remove o horário
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

        fetchDespesas();
    }, []);

    const toggleDropdown = (index: number) => {
        // Se já estiver expandido, fecha; caso contrário, expande
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            {painelValues.map((despesa: Receitas, index: number) => (
                <TouchableOpacity key={index} onPress={() => toggleDropdown(index)} style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{despesa.nome}</Text>
                        <Text style={styles.date}>{despesa.data}</Text>
                    </View>
                    <Text style={styles.valueDespesa}>R$ {despesa.valor}</Text>

                    {/* Dropdown para mostrar informações adicionais */}
                    {expandedIndex === index && (
                        <View style={styles.dropdown}>
                            <Text>Categoria: {despesa.categoriaId}</Text>
                            <Text>Descrição: {despesa.descricao}</Text>
                            <Text>Criado em: {despesa.created_at}</Text>
                            <Text>Atualizado em: {despesa.updated_at}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        width: '90%', // Garante que a largura seja consistente
        maxWidth: 350,  // Limita a largura máxima da View
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Para que o nome e a data fiquem nas extremidades
        alignItems: 'center', // Centraliza verticalmente
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center', 
    },
    date: {
        fontSize: 14,
        color: "#555",
        textAlign: 'center', 
    },
    valueDespesa: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e7d32", // Vermelho para indicar despesa
    },
    dropdown: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
    },
});
