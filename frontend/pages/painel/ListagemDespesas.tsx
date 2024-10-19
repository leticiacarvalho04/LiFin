import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import Despesas from "../../types/despesas";
import { Categoria } from "../../types/categoria";
import Dropdown from "../../components/dropdown";
import { API_URL } from "../../api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import ModalSucesso from "../../components/modalSucesso";
import ModalConfirmacaoDelete from "../../components/modalConfirmacaoDelete";
import { NavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";

export default function ListagemDespesas() {
    const [painelValues, setPainelValues] = useState<Despesas[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editedDespesa, setEditedDespesa] = useState<Despesas | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({ nome: '', tipoSucesso: '' });
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [despesaToDelete, setDespesaToDelete] = useState<Despesas | null>(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const fetchCategorias = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.navigate('Login');
            return;
          }
    
          const response = await axios.get(`${API_URL}/categorias`, {
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

    useEffect(() => {
        const fetchDespesas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }
                const response = await axios.get(`${API_URL}/despesas`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                const despesasFirestore = response.data;

                const storedDespesasJSON = await AsyncStorage.getItem('despesas');
                const storedDespesas = storedDespesasJSON ? JSON.parse(storedDespesasJSON) : [];

                if (JSON.stringify(despesasFirestore) !== JSON.stringify(storedDespesas) || storedDespesas.length === 0) {
                    await AsyncStorage.setItem('despesas', JSON.stringify(despesasFirestore));
                    const despesasData = response.data.map((despesa: Despesas): Despesas => ({
                        ...despesa,
                        data: despesa.data ? despesa.data.split("T")[0].split('-').reverse().join('-') : ""
                    }));                    
                    setPainelValues(despesasData);
                } else {
                    setPainelValues(storedDespesas);
                }
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            }
        };

        fetchCategorias();
        fetchDespesas();
    }, []);

     // UseEffect para buscar categorias toda vez que a tela estiver em foco
    useEffect(() => {
        if (isFocused) {
        fetchCategorias();
        }
    }, [isFocused]);

    const handleEdit = (index: number) => {
        setIsEditing(isEditing === index ? null : index);
        setEditedDespesa(painelValues[index]);
        if (painelValues[index].data) {
            const dateParts = painelValues[index].data.split('-');
            const year = parseInt(dateParts[2], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const day = parseInt(dateParts[0], 10);
            setDate(new Date(year, month, day));
        }
    };

    const handleInputChange = (field: keyof Despesas, value: string) => {
        if (editedDespesa) {
            setEditedDespesa({ ...editedDespesa, [field]: value });
        }
    };

    const formatarData = (dataString: string): string => {
        if (!dataString) return "";
        const [ano, mes, dia] = dataString.split('-'); // A ordem é YYYY-MM-DD
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        return `${dia} de ${meses[parseInt(mes, 10) - 1]} de ${ano}`;
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
            if (editedDespesa) {
                const formattedDate = formatDateToSave(selectedDate);
                setEditedDespesa({ ...editedDespesa, data: formattedDate });
            }
        }
        setShowDatePicker(false);
    };

    const handleSave = async (index: number) => {
        if (editedDespesa) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }
                editedDespesa.data = formatDateToSave(date);
                await axios.put(`${API_URL}/atualizar/despesa/${editedDespesa.id}`, editedDespesa, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                const updatedPainelValues = [...painelValues];
                updatedPainelValues[index] = editedDespesa;
                setPainelValues(updatedPainelValues);
                setIsEditing(null);
                setEditedDespesa(null);
                setModalMessage({ nome: 'Despesa', tipoSucesso: 'editada' });
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao salvar despesa:", error);
            }
        }
    };

    const confirmDelete = async () => {
        if (despesaToDelete) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }

                await axios.delete(`${API_URL}/excluir/despesa/${despesaToDelete.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                setPainelValues(prev => prev.filter(despesa => despesa.id !== despesaToDelete.id));
                setModalMessage({ nome: 'Despesa', tipoSucesso: 'excluída' });
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao deletar despesa:", error);
            } finally {
                setConfirmDeleteVisible(false);
                setDespesaToDelete(null);
            }
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleCloseConfirmModal = () => {
        setConfirmDeleteVisible(false);
    };

    const handleDelete = (despesa: Despesas) => {
        setDespesaToDelete(despesa);
        setConfirmDeleteVisible(true);
    };

    const getCategoriaNome = (categoriaId: string) => {
        const categoria = categorias.find((cat) => cat.id === categoriaId);
        return categoria ? categoria.nome : "Categoria desconhecida";
    };

    const agruparDespesasPorMesEAno = (despesas: Despesas[]) => {
        const despesasAgrupadas: { [key: string]: Despesas[] } = {};

        despesas.forEach(despesa => {
            const [dia, mes, ano] = despesa.data.split('-');
            const meses = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];

            const mesNome = meses[parseInt(mes, 10) - 1];
            const chaveMesAno = `${mesNome} de ${ano}`;

            if (!despesasAgrupadas[chaveMesAno]) {
                despesasAgrupadas[chaveMesAno] = [];
            }
            despesasAgrupadas[chaveMesAno].push(despesa);
        });

        for (const mesAno in despesasAgrupadas) {
            despesasAgrupadas[mesAno] = despesasAgrupadas[mesAno].sort((a, b) => {
                return new Date(a.data).getTime() - new Date(b.data).getTime();
            });
        }

        return despesasAgrupadas;
    };

    const despesasAgrupadas = agruparDespesasPorMesEAno(painelValues);

    return (
        <View style={styles.container}>
            {Object.keys(despesasAgrupadas).map((mesAno) => (
                <View key={mesAno}>
                    <Text style={styles.mesAno}>{mesAno}</Text>
                    {despesasAgrupadas[mesAno].map((despesa, index) => (
                        <Dropdown key={despesa.id} title={despesa.nome} date={formatarData(despesa.data)} value={despesa.valor.toString()} valueColor="#d32f2f">
                            {isEditing === index ? (
                                <View>
                                    <Text>Nome</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editedDespesa ? editedDespesa.nome : ''}
                                        onChangeText={(value) => handleInputChange("nome", value)}
                                    />
                                    <Text>Valor</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editedDespesa ? editedDespesa.valor.toString() : ''}
                                        onChangeText={(value) => handleInputChange("valor", value)}
                                    />
                                    <Text>Data</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                        <Text>{editedDespesa ? formatarData(editedDespesa.data) : ''}</Text>
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
                                        selectedValue={editedDespesa ? editedDespesa.categoriaId : ''}
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
                visible={modalVisible}
                onClose={handleCloseModal}
                nome={`${modalMessage.nome}`}
                tipoSucesso="editada"
            />
            <ModalConfirmacaoDelete
                visible={confirmDeleteVisible}
                onClose={handleCloseConfirmModal}
                onConfirm={confirmDelete}
                nome={'Despesa'}
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