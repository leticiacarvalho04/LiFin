import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Receitas } from "../../types/receitas";
import { Categoria } from "../../types/categoria";
import { API_URL } from "../../api";
import Dropdown from "../../components/dropdown";
import Icon from "react-native-vector-icons/MaterialIcons";
import Swal from "sweetalert2";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ModalSucesso from "../../components/modalSucesso";
import ModalConfirmacaoDelete from "../../components/modalConfirmacaoDelete";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListagemReceitas() {
    const [painelValues, setPainelValues] = useState<Receitas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null); // Alterei para armazenar o índice da despesa em edição
    const [editedReceita, setEditedReceita] = useState<Receitas | null>(null); // Estado para armazenar a despesa em edição
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage ] = useState({ nome: '', tipoSucesso: '' });
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Modal de confirmação de exclusão
    const [receitaToDelete, setReceitaToDelete] = useState<Receitas | null>(null); 


    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${API_URL}/categorias`);
            const categoriasFirestore = response.data;

            // Tenta recuperar categorias do AsyncStorage
            const storedCategoriasJSON = await AsyncStorage.getItem('categorias');
            const storedCategorias = storedCategoriasJSON ? JSON.parse(storedCategoriasJSON) : [];

            // Se as categorias no Firestore forem diferentes das armazenadas ou se não houver registros
            if (JSON.stringify(categoriasFirestore) !== JSON.stringify(storedCategorias) || storedCategorias.length === 0) {
            // Atualiza o AsyncStorage e o estado
            await AsyncStorage.setItem('categorias', JSON.stringify(categoriasFirestore));
            setCategorias(categoriasFirestore);
            } else {
            // Se as categorias estiverem iguais, apenas as define do AsyncStorage
            setCategorias(storedCategorias);
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const response = await axios.get(`${API_URL}/receitas`);
                const receitasFirestore = response.data;

                // Tenta recuperar categorias do AsyncStorage
                const storedReceitasJSON = await AsyncStorage.getItem('despesas');
                const storedReceitas = storedReceitasJSON ? JSON.parse(storedReceitasJSON) : [];
                
                // Se as categorias no Firestore forem diferentes das armazenadas ou se não houver registros
                if (JSON.stringify(receitasFirestore) !== JSON.stringify(storedReceitas) || storedReceitas.length === 0) {
                    // Atualiza o AsyncStorage e o estado
                    await AsyncStorage.setItem('categorias', JSON.stringify(receitasFirestore));
                    const receitasData = response.data.map((receita: Receitas): Receitas => {
                        return {
                            ...receita,
                            data: receita.data ? receita.data.split('T')[0] : '', // Formatar a data para DD-MM-YYYY
                        }
                    });
                    setPainelValues(receitasData);
                } else {
                    // Se as categorias estiverem iguais, apenas as define do AsyncStorage
                    setPainelValues(storedReceitas);
                }
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
            }
        };

        fetchCategorias();
        fetchReceitas();
    }, []);

    const formatarData = (dataString: string): string => {
        const [dia, mes, ano] = dataString.split('-'); 
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        
        const mesNome = meses[parseInt(mes, 10) - 1]; 
        return `${dia} de ${mesNome} de ${ano}`;
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
        setEditedReceita(painelValues[index]);
    
        if (painelValues[index].data) {
            const dateParts = painelValues[index].data.split('-'); 
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; 
            const year = parseInt(dateParts[2], 10);
            setDate(new Date(day, month, year)); 
        }
    };

    const handleInputChange = (field: keyof Receitas, value: string) => {
        if (editedReceita) {
            setEditedReceita({ ...editedReceita, [field]: value });
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            if (editedReceita) {
                const formattedDate = formatDate(selectedDate);
                setEditedReceita({ ...editedReceita, data: formattedDate });
            }
        }
        setShowDatePicker(false);
    };

    const handleSave = async (index: number) => {
        if (editedReceita) {
            try {
                await axios.put(`${API_URL}/atualizar/receita/${editedReceita.id}`, editedReceita);
                const updatedPainelValues = [...painelValues];
                updatedPainelValues[index] = editedReceita;
                setPainelValues(updatedPainelValues);
                setIsEditing(null);
                setEditedReceita(null);

                // Exibir modal de sucesso após edição
                setModalMessage({ nome: 'Receita', tipoSucesso: 'editada' });
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao salvar receita:", error);
            }
        }
    };

    const formatDateToSave = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
    };

    const handleCancel = (receita: Receitas) => {
        setReceitaToDelete(receita);
        setConfirmDeleteVisible(true);
    };

    const handleDelete = (receita: Receitas) => {
        setReceitaToDelete(receita);
        setConfirmDeleteVisible(true);
    }

    const confirmDelete = async () => {
        if (receitaToDelete){
            try {
                await axios.delete(`${API_URL}/excluir/receita/${receitaToDelete.id}`);
                setPainelValues(prev => prev.filter(receita => receita.id !== receitaToDelete.id));
                setModalMessage({ nome: 'Receita', tipoSucesso: 'excluída' });
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao deletar receita:", error);
            } finally {
                setConfirmDeleteVisible(false);
                setReceitaToDelete(null);
            }
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false); 
    };

    const handleCloseConfirmModal = () => {
        setConfirmDeleteVisible(false);
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
                            <View style={styles.content}>
                                <Text>Nome</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedReceita?.nome}
                                    onChangeText={(text) => handleInputChange('nome', text)}
                                />
                                <Text>Valor</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedReceita?.valor.toString()}
                                    onChangeText={(text) => handleInputChange('valor', text)}
                                />
                                <Text>Descrição</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedReceita?.descricao}
                                    onChangeText={(text) => handleInputChange('descricao', text)}
                                />
                                <Text>Data</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                    <Text>{editedReceita?.data}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        mode="date"
                                        value={date} 
                                        onChange={handleDateChange}
                                        display="default"
                                    />
                                )}
                                <Text>Categoria</Text>
                                <Picker
                                    selectedValue={editedReceita?.categoriaId}
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
                                <Text>Nome: {receita.nome}</Text>
                                <Text>Valor: {receita.valor}</Text>
                                <Text>Data: {receita.data}</Text>
                                <Text>Categoria: {getCategoriaNome(receita.categoriaId)}</Text>
                                <Text>Descrição: {receita.descricao}</Text>
                                <View style={styles.botoes}>
                                    <View style={styles.btn}>
                                        <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                                            <Icon name='edit' size={24} color="#000" />
                                            <Text>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(receita)} style={styles.deleteButton}>
                                            <Icon name='delete' size={24} color="#000" />
                                            <Text>Deletar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                </Dropdown>
            ))}

            <ModalSucesso 
                nome="Receita"
                visible={modalVisible} 
                tipoSucesso={`A ${modalMessage.nome} foi ${modalMessage.tipoSucesso} com sucesso!`} 
                onClose={handleCloseModal} 
            />
            <ModalConfirmacaoDelete 
                visible={confirmDeleteVisible} 
                onClose={handleCloseConfirmModal} 
                onConfirm={confirmDelete} 
                nome={receitaToDelete ? receitaToDelete.nome : ''} 
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
        backgroundColor: '#A164E3',
        borderRadius: 5,
        padding: 10,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#000',
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
