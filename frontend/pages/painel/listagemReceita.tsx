import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Receitas } from "../../types/receitas";
import { Categoria } from "../../types/categoria";
import { API_URL } from "../../api";
import Dropdown from "../../components/dropdown";
import Icon from "react-native-vector-icons/Feather";
import Swal from "sweetalert2";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ModalSucesso from "../../components/modalSucesso";
import ModalConfirmacaoDelete from "../../components/modalConfirmacaoDelete";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";

export default function ListagemReceitas() {
    const [painelValues, setPainelValues] = useState<Receitas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null); // Alterei para armazenar o índice da receita em edição
    const [editedReceita, setEditedReceita] = useState<Receitas | null>(null); // Estado para armazenar a despesa em edição
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage ] = useState({ nome: '', tipoSucesso: '' });
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Modal de confirmação de exclusão
    const [receitaToDelete, setReceitaToDelete] = useState<Receitas | null>(null); 
    const isFocused = useIsFocused();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const fetchCategorias = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.navigate('Login');
            return;
          }
    
          const response = await axios.get(`${API_URL}/receitas/categorias`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          const categoriasFirestore = response.data;
          const storedCategoriasJSON = await AsyncStorage.getItem('categorias');
          const storedCategorias = storedCategoriasJSON ? JSON.parse(storedCategoriasJSON) : [];
    
          if (JSON.stringify(categoriasFirestore) !== JSON.stringify(storedCategorias) || storedCategorias.length === 0) {
            await AsyncStorage.setItem('categorias', JSON.stringify(categoriasFirestore));
            setCategorias(categoriasFirestore);
          } else {
            setCategorias(storedCategorias);
          }
        } catch (error) {
          console.error("Erro ao buscar categorias:", error);
          if ((error as any).response?.status === 401) {
            navigation.navigate('Login');
          }
        }
    };

    const fetchReceitas = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
                return;
            }
            const response = await axios.get(`${API_URL}/receitas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
                        data: receita.data.split("T")[0]
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

    useEffect(() => {
        fetchCategorias();
        fetchReceitas();
    }, []);

    useEffect(() => {
        if (isFocused) {
        fetchCategorias();
        fetchReceitas();
        }
    }, [isFocused]);

    const formatarData = (dataString: string): string => {
        const [dia, mes, ano] = dataString.split('-');
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const mesNome = meses[parseInt(mes, 10) - 1];
        return `${dia} de ${mesNome} de ${ano}`;
    };

    const formatDateToSave = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            if (editedReceita) {
                const formattedDate = formatDateToSave(selectedDate);
                setEditedReceita({ ...editedReceita, data: formattedDate });
            }
        }
        setShowDatePicker(false);
    };

    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria não selecionada";
    };

    const handleEdit = (index: number) => {
        setIsEditing(isEditing === index ? null : index);
        setEditedReceita(painelValues[index]);
        if (painelValues[index].data) {
            const dateParts = painelValues[index].data.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const day = parseInt(dateParts[2], 10);
            setDate(new Date(day, month, year));
        } 
    }; 

    const handleInputChange = (field: keyof Receitas, value: string) => {
        if (editedReceita) {
            setEditedReceita({ ...editedReceita, [field]: value });
        }
    };

    const handleSave = async (index: number) => {
        if (editedReceita) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }
                await axios.put(`${API_URL}/atualizar/receita/${editedReceita.id}`, editedReceita, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
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
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }
                await axios.delete(`${API_URL}/excluir/receita/${receitaToDelete.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
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

    const agruparReceitasPorMesEAno = (receitas: Receitas[]) => {
        const receitasAgrupadas: { [key: string]: Receitas[] } = {};

        receitas.forEach(despesa => {
            const [dia, mes, ano] = despesa.data.split('-');
            const meses = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];

            const mesNome = meses[parseInt(mes, 10) - 1];
            const chaveMesAno = `${mesNome} de ${ano}`;

            if (!receitasAgrupadas[chaveMesAno]) {
                receitasAgrupadas[chaveMesAno] = [];
            }
            receitasAgrupadas[chaveMesAno].push(despesa);
        });

        for (const mesAno in receitasAgrupadas) {
            receitasAgrupadas[mesAno] = receitasAgrupadas[mesAno].sort((a, b) => {
                return new Date(a.data).getTime() - new Date(b.data).getTime();
            });
        }

        return receitasAgrupadas;
    };

    const receitasAgrupadas = agruparReceitasPorMesEAno(painelValues);


    return (
        <View style={styles.container}>
            {Object.keys(receitasAgrupadas).map((mesAno) => (
                <View key={mesAno}>
                    <Text style={styles.mesAno}>{mesAno}</Text>
                    {receitasAgrupadas[mesAno].map((receita, index) => (
                        <Dropdown key={receita.id} title={receita.nome} date={formatarData(receita.data)} value={receita.valor.toString()} valueColor="#2e7d32">
                            {isEditing === index ? (
                                <View>
                                    <Text>Nome</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editedReceita ? editedReceita.nome : ''}
                                        onChangeText={(value) => handleInputChange("nome", value)}
                                    />
                                    <Text>Valor</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editedReceita ? editedReceita.valor.toString() : ''}
                                        onChangeText={(value) => handleInputChange("valor", value)}
                                    />
                                    <Text>Data</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                        <Text>{editedReceita ? formatarData(editedReceita.data) : ''}</Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateChange}
                                        />
                                    )}
                                    <Text>Categoria</Text>
                                    <Picker
                                        selectedValue={editedReceita ? editedReceita.categoriaId : ''}
                                        onValueChange={(itemValue) => handleInputChange("categoriaId", itemValue)}
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
                                    <Text>Data: {formatarData(receita.data)}</Text>
                                    <Text>Categoria: {getCategoriaNome(receita.categoriaId)}</Text>
                                    <Text>Descrição: {receita.descricao}</Text>
                                    <View style={styles.botoes}>
                                        <View style={styles.btn}>
                                            <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                                                <Icon name='edit' size={24} color="#000" />
                                                <Text>Editar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(receita)} style={styles.deleteButton}>
                                                <Icon name='trash' size={24} color="#000" />
                                                <Text>Deletar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Dropdown>
                    ))}
                </View>
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
    mesAno: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
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