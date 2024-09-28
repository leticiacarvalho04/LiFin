import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"; 
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";
import Dropdown from "../../components/dropdown";
import { API_URL } from "../../api";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swal from 'sweetalert2';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ModalSucesso from "../../components/modalSucesso";
import ModalConfirmacaoDelete from "../../components/modalConfirmacaoDelete";

export default function ListagemDespesas() {
    const [painelValues, setPainelValues] = useState<Despesas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedDespesa, setEditedDespesa] = useState<Despesas | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date()); 
    const [modalVisible, setModalVisible] = useState(false); // Modal de sucesso
    const [modalMessage, setModalMessage] = useState({ nome: '', tipoSucesso: '' });
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Modal de confirmação de exclusão
    const [despesaToDelete, setDespesaToDelete] = useState<Despesas | null>(null); 

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
                        ...despesa,
                        data: despesa.data ? despesa.data.split("T")[0] : "" // Formatação da data
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

    // Função para formatar a data no formato "dd de <nome do mês> de yyyy"
    const formatarData = (dataString: string): string => {
        const [dia, mes, ano] = dataString.split('-'); // Desestruturando a data
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        const mesNome = meses[parseInt(mes, 10) - 1]; // Obtendo o nome do mês
        return `${dia} de ${mesNome} de ${ano}`; // Formatando a data
    };

    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria desconhecida";
    };

    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleEdit = (index: number) => {
        setIsEditing(isEditing === index ? null : index);
        setEditedDespesa(painelValues[index]);
    
        if (painelValues[index].data) {
            // Converta a string da data para o formato adequado (YYYY-MM-DD)
            const dateParts = painelValues[index].data.split('-'); // Divide a string de data (DD-MM-YYYY)
            const day = parseInt(dateParts[0], 10); // Dia
            const month = parseInt(dateParts[1], 10) - 1; // Mês (os meses começam em 0 no objeto Date)
            const year = parseInt(dateParts[2], 10); // Ano
            setDate(new Date(day, month, year)); // Define a data correta no state
        }
    };

    const handleInputChange = (field: keyof Despesas, value: string) => {
        if (editedDespesa) {
            setEditedDespesa({ ...editedDespesa, [field]: value });
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            if (editedDespesa) {
                const formattedDate = formatDate(selectedDate);
                setEditedDespesa({ ...editedDespesa, data: formattedDate });
            }
        }
        setShowDatePicker(false);
    };

    const handleSave = async (index: number) => {
        if (editedDespesa) {
            try {
                editedDespesa.data = formatDateToSave(date); // Formata a data para salvar corretamente
                await axios.put(`${API_URL}/atualizar/despesa/${editedDespesa.id}`, editedDespesa);
                const updatedPainelValues = [...painelValues];
                updatedPainelValues[index] = editedDespesa;
                setPainelValues(updatedPainelValues);
                setIsEditing(null);
                setEditedDespesa(null);

                // Exibir modal de sucesso após edição
                setModalMessage({ nome: 'Despesa', tipoSucesso: 'editada' });
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao salvar despesa:", error);
            }
        }
    };

    const formatDateToSave = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Formato para salvar no backend (YYYY-MM-DD)
    };

    const handleDelete = (despesa: Despesas) => {
        setDespesaToDelete(despesa); // Armazena a despesa que será excluída
        setConfirmDeleteVisible(true); // Mostra o modal de confirmação
    };

    const confirmDelete = async () => {
        if (despesaToDelete) {
            try {
                await axios.delete(`${API_URL}/excluir/despesa/${despesaToDelete.id}`);
                setPainelValues(prev => prev.filter(despesa => despesa.id !== despesaToDelete.id)); // Remove a despesa da lista
                setModalMessage({ nome: 'Despesa', tipoSucesso: 'excluída' });
                setModalVisible(true); // Mostra o modal de sucesso
            } catch (error) {
                console.error("Erro ao deletar despesa:", error);
            } finally {
                setConfirmDeleteVisible(false); // Fecha o modal de confirmação
                setDespesaToDelete(null); // Limpa a despesa a ser excluída
            }
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Fechar modal de sucesso
    };

    const handleCloseConfirmModal = () => {
        setConfirmDeleteVisible(false);
    };
    
    return (
        <View style={styles.container}>
            {painelValues.map((despesa: Despesas, index: number) => (
                <View key={index}>
                    <Dropdown 
                        title={despesa.nome} 
                        date={formatarData(despesa.data)} 
                        value={despesa.valor.toString()} 
                        valueColor="#d32f2f" 
                    >
                        {isEditing === index ? (
                            <View style={styles.content}>
                                <Text>Nome</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.nome}
                                    onChangeText={(text) => handleInputChange('nome', text)}
                                    placeholder="Nome"
                                />
                                <Text>Valor</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.valor.toString()}
                                    onChangeText={(text) => handleInputChange('valor', text)}
                                    placeholder="Valor"
                                    keyboardType="numeric"
                                />
                                <Text>Descrição</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedDespesa?.descricao}
                                    onChangeText={(text) => handleInputChange('descricao', text)}
                                    placeholder="Descrição"
                                />
                                <Text>Data</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                    <Text>{editedDespesa?.data}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        mode="date"
                                        value={date} // Agora passando a data correta aqui
                                        onChange={handleDateChange}
                                        display="default"
                                    />
                                )}
                                <Text>Categoria</Text>
                                <Picker
                                    selectedValue={editedDespesa?.categoriaId}
                                    onValueChange={(itemValue) => handleInputChange('categoriaId', itemValue)}
                                    style={styles.input}
                                >
                                    <Picker.Item label="Selecione uma categoria" value="" />
                                    {categorias.map((categoria) => (
                                        <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                                    ))}
                                </Picker>
                                <View style={styles.botoes}>
                                    <TouchableOpacity onPress={() => handleSave(index)} style={styles.saveButton}>
                                        <Text style={styles.saveButtonText}>Salvar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsEditing(null)} style={styles.cancelButton}>
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View>
                                <Text>Nome: {despesa.nome}</Text>
                                <Text>Valor: {despesa.valor}</Text>
                                <Text>Data: {formatarData(despesa.data)}</Text>
                                <Text>Categoria: {getCategoriaNome(despesa.categoriaId)}</Text>
                                <Text>Descrição: {despesa.descricao}</Text>
                                <View style={styles.botoes}>
                                    <View style={styles.btn}>
                                        <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                                            <Icon name='edit' size={24} color="#000" />
                                            <Text>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(despesa)} style={styles.deleteButton}>
                                            <Icon name='delete' size={24} color="#000" />
                                            <Text>Deletar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Dropdown>
                </View>
            ))}

            <ModalSucesso 
                nome="Despesa"
                visible={modalVisible} 
                tipoSucesso={`A ${modalMessage.nome} foi ${modalMessage.tipoSucesso} com sucesso!`} 
                onClose={handleCloseModal} 
            />
            <ModalConfirmacaoDelete 
                visible={confirmDeleteVisible} 
                onClose={handleCloseConfirmModal} 
                onConfirm={confirmDelete} 
                nome={despesaToDelete ? despesaToDelete.nome : ''} // Nome da despesa a ser excluída
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
    },
    content: {
        width: '100%',
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        alignItems: 'center',
        gap: 15,
        width: '100%',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#4caf50',
        borderRadius: 5,
        padding: 10,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        padding: 10,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
