import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";

export default function ListagemDespesas() {
    const initialValues: Despesas[] = [];
    const [painelValues, setPainelValues] = useState<Despesas[]>(initialValues);
    const [categorias, setCategorias] = useState<Categoria[]>([]); // Armazena as categorias
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Para controlar qual despesa está expandida

    // Função para buscar as categorias
    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://192.168.0.14:3000/categorias'); // Endpoint das categorias
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    useEffect(() => {
        const fetchDespesas = async () => {
            try {
                const response = await axios.get('http://192.168.0.14:3000/despesas');
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

        fetchCategorias(); // Carrega as categorias ao montar o componente
        fetchDespesas();   // Carrega as despesas
    }, []);

    // Função para obter o nome da categoria com base no categoriaId
    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria desconhecida";
    };

    const toggleDropdown = (index: number) => {
        // Se já estiver expandido, fecha; caso contrário, expande
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            {painelValues.map((despesa: Despesas, index: number) => (
                <TouchableOpacity key={index} onPress={() => toggleDropdown(index)} style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{despesa.nome}</Text>
                        <Text style={styles.date}>{despesa.data}</Text>
                    </View>
                    <Text style={styles.valueDespesa}>R$ {despesa.valor}</Text>
    
                    {/* Dropdown para mostrar informações adicionais */}
                    {expandedIndex === index && (
                        <View style={styles.dropdown}>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Nome:</Text>
                                <Text style={styles.dropdownText}>{despesa.nome}</Text>
                            </View>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Categoria:</Text>
                                {/* Certifique-se de que o nome da categoria esteja dentro de um <Text> */}
                                <Text style={styles.dropdownText}>{getCategoriaNome(despesa.categoriaId)}</Text> 
                            </View>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Valor:</Text>
                                <Text style={styles.dropdownText}>R$ {despesa.valor}</Text>
                            </View>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Descrição:</Text>
                                <Text style={styles.dropdownText}>{despesa.descricao}</Text>
                            </View>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Criado em:</Text>
                                <Text style={styles.dropdownText}>{despesa.created_at}</Text>
                            </View>
                            <View style={styles.dropdownItem}>
                                <Text style={styles.dropdownLabel}>Atualizado em:</Text>
                                <Text style={styles.dropdownText}>{despesa.updated_at}</Text>
                            </View>
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
        width: '90%',
        maxWidth: 350,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        color: "#d32f2f",
        textAlign: 'left',
    },
    dropdown: {
        marginTop: 10,
        padding: 10,
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    dropdownItem: {
        marginBottom: 8,
    },
    dropdownLabel: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    dropdownText: {
        flex: 1,
    },
});
