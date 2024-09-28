import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";
import Dropdown from "../../components/dropdown";
import { API_URL } from "../../api";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swal from 'sweetalert2';

export default function ListagemDespesas() {
    const [painelValues, setPainelValues] = useState<Despesas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedDespesa, setEditedDespesa] = useState<Despesas | null>(null);

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
                        data: formatDate(despesa.data), // Formatação correta da data
                        descricao: despesa.descricao,
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

    const formatDate = (dateValue: string): string => {
        const [day, month, year] = dateValue.split('-'); // Desconstrói a string no formato DD-MM-YYYY

        // Verifica se todos os valores estão disponíveis
        if (!day || !month || !year) {
            console.error("Formato de data inválido:", dateValue);
            return "Data inválida"; // Retorna uma string padrão em caso de data inválida
        }

        // Cria um objeto Date com os valores extraídos
        const formattedDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        
        // Verifica se a data é válida
        if (isNaN(formattedDate.getTime())) {
            console.error("Data inválida:", dateValue);
            return "Data inválida"; // Retorna uma string padrão em caso de data inválida
        }

        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return formattedDate.toLocaleDateString('pt-BR', options); // Formata para o padrão desejado
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
                // Atualiza a data da despesa antes de salvar
                editedDespesa.data = formatDateToSave(editedDespesa.data); // Formato para o backend
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

    const formatDateToSave = (date: string): string => {
        // Formata a data para o padrão ISO ou qualquer formato que o backend espera
        const dateObj = new Date(date);
        return dateObj.toISOString(); // Formato ISO para o backend
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
            {painelValues.map((despesa: Despesas, index: number) => (
                <View key={index}>
                    <Dropdown 
                        title={despesa.nome} 
                        date={despesa.data} // Agora já está no formato correto
                        value={despesa.valor.toString()} 
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
                                <Text>Nome: {despesa.nome}</Text>
                                <Text>Valor: {despesa.valor}</Text>
                                <Text>Data: {despesa.data}</Text>
                                <Text>Categoria: {getCategoriaNome(despesa.categoriaId)}</Text>
                                <Text>Descrição: {despesa.descricao}</Text>
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
    botoes: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        alignItems: 'center',
        width: '100%',
        gap: 100, 
        marginLeft: 17,
    },
    editButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 5,
    },
    deleteButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 5,
    },
    saveButton: {
        backgroundColor: "#4caf50",
        borderRadius: 10,
        padding: 5,
        marginRight: 10,
    },
    saveButtonText: {
        color: "#fff",
    },
    cancelButton: {
        backgroundColor: "#f44336",
        borderRadius: 10,
        padding: 5,
    },
    cancelButtonText: {
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        marginVertical: 5,
        padding: 5,
        width: '100%',
    },
});
