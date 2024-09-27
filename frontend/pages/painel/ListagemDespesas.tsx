import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";
import Dropdown from "../../components/dropdown";
import { API_URL } from "../../api";
import Icon from "react-native-vector-icons/MaterialIcons"; // Corrigi a importação do ícone
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import Swal from 'sweetalert2'; // Importe o SweetAlert

export default function ListagemDespesas() {
    const [painelValues, setPainelValues] = useState<Despesas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<number | null>(null); // Alterei para armazenar o índice da despesa em edição
    const [editedDespesa, setEditedDespesa] = useState<Despesas | null>(null); // Estado para armazenar a despesa em edição

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
                        id: despesa.id,
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

    const handleEdit = (index: number) => {
        setIsEditing(isEditing === index ? null : index);
        setEditedDespesa(painelValues[index]);
    };

    const handleInputChange = (field: keyof Despesas, value: string) => {
        if (editedDespesa) {
            setEditedDespesa({ ...editedDespesa, [field]: value });
        }
    };

    const handleSave = async (index: number) => {
        if (editedDespesa) {
            try {
                await axios.put(`${API_URL}/despesas/${editedDespesa.id}`, editedDespesa);
                const updatedPainelValues = [...painelValues];
                updatedPainelValues[index] = editedDespesa;
                setPainelValues(updatedPainelValues);
                setIsEditing(null);
                setEditedDespesa(null);
            } catch (error) {
                console.error("Erro ao salvar despesa:", error);
            }
        }
    };

    const handleDelete = async (index: number) => {
        try {
            const deleteDespesa = painelValues[index];
            if (deleteDespesa) {
                await axios.delete(`${API_URL}/deletar/despesas/${deleteDespesa.id}`);
                const updatedPainelValues = painelValues.filter((_, i) => i !== index);
                setPainelValues(updatedPainelValues);
                setIsEditing(null);
                setEditedDespesa(null);
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Despesa deletada com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                console.error("Erro: deleteDespesa é null");
            }
        } catch (error) {
            console.error("Erro ao deletar despesa:", error);
        }
    };

    return (
        <View style={styles.container}>
            {painelValues.map((despesa: Despesas, index: number) => (
                <View key={index}>
                    <Dropdown 
                        title={despesa.nome} 
                        date={despesa.data} 
                        value={despesa.valor.toString()} // Certifique-se que o valor é uma string
                        valueColor="#d32f2f" 
                    >
                        {isEditing === index ? (
                            <View>
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.nome}
                                    onChangeText={(text) => handleInputChange('nome', text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.valor.toString()}
                                    onChangeText={(text) => handleInputChange('valor', text)}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.descricao}
                                    onChangeText={(text) => handleInputChange('descricao', text)}
                                />
                                <TouchableOpacity onPress={() => handleSave(index)} style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <Text>Categoria: {getCategoriaNome(despesa.categoriaId)}</Text>
                                <Text>Descrição: {despesa.descricao}</Text>
                                <Text>Criado em: {despesa.created_at}</Text>
                                <Text>Atualizado em: {despesa.updated_at}</Text>
                                <View>
                                    <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                                        <Icon name='edit' size={24} color="#000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                                        <Icon name='delete' size={24} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Dropdown>
                </View>
            ))}
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    deleteButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveButtonText: {
        color: "#fff",
        textAlign: "center",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    editContainer: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
});