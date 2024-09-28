import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Receitas } from "../../types/receitas";
import { Categoria } from "../../types/categoria";
import { API_URL } from "../../api";
import Dropdown from "../../components/dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swal from "sweetalert2";

export default function ListagemReceitas() {
    const [painelValues, setPainelValues] = useState<Receitas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<number | null>(null); // Alterei para armazenar o índice da despesa em edição
    const [editedDespesa, setEditedDespesa] = useState<Receitas | null>(null); // Estado para armazenar a despesa em edição

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

    const handleEdit = (index: number) => {
        setIsEditing(isEditing === index ? null : index);
        setEditedDespesa(painelValues[index]);
    };

    const handleInputChange = (field: keyof Receitas, value: string) => {
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

    const handleCancel = () => {
        setIsEditing(null);
        setEditedDespesa(null);
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
            {painelValues.map((receita: Receitas, index: number) => (
                <Dropdown 
                    key={index} 
                    title={receita.nome} 
                    date={receita.data} 
                    value={receita.valor} 
                    valueColor="#2e7d32"  
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
                                <View style={styles.botoes}>
                                    <TouchableOpacity onPress={() => handleSave(index)} style={styles.saveButton}>
                                        <Text style={styles.saveButtonText}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View>
                                <Text>Nome: {receita.nome}</Text>
                                <Text>Valor: {receita.valor}</Text>
                                <Text>Data: {receita.data}</Text>
                                <Text>Categoria: {getCategoriaNome(receita.categoriaId)}</Text>
                                <Text>Descrição: {receita.descricao}</Text>
                                <View style={styles.botoes}>
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
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'center', // Alterado para 'center'
        marginVertical: 20,
        alignItems: 'center',
        width: '100%',
        gap: 100, 
        marginLeft: 17, // Adicione margem à esquerda
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
    cancelButton: {
        backgroundColor: "#f44336", // Vermelho
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
    cancelButtonText: {
        color: "#fff",
        textAlign: "center",
    },
    
});
