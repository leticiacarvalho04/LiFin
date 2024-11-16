import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Layout from "../../components/layout";
import ProgressBar from "../../components/progressBar";
import axios from "axios";
import { API_URL } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { NavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { Meta } from "../../types/metas";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalSucesso from "../../components/modalSucesso";
import ModalConfirmacaoDelete from "../../components/modalConfirmacaoDelete";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PainelMetas() {
  const [painelValues, setPainelValues] = useState<Meta[]>([]);
  const [metas, setMetas] = useState<any[]>([]); // Lista de metas
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedMeta, setEditedMeta] = useState<Meta | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState<Meta | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const isFocused = useIsFocused();

  const fetchMetas = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token não encontrado. Redirecionando para login.");
            return;
        }

        const response = await axios.get(`${API_URL}/metas`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const despesasFirestore = response.data.map((meta: Meta): Meta => ({
            ...meta,
            data: meta.data
                ? meta.data.split("T")[0].split("-").reverse().join("-")
                : "",
        }));

        setMetas(despesasFirestore);
        setPainelValues(despesasFirestore);
        await AsyncStorage.setItem("metas", JSON.stringify(despesasFirestore));
    } catch (error) {
        console.error("Erro ao buscar metas:", error);
    }
  };

  const formatarPorcentagem = (valor: number): string => {
    return `${valor.toFixed(2).replace(".", ",")}%`;
  };  

  const calculatePercentage = (valorAtual: number, valorTotal: number): number => {
    if (valorTotal <= 0) return 0; // Evita divisão por zero
    return Math.min(100, (valorAtual / valorTotal) * 100); // Limita a porcentagem a 100%
  };

  const handleInputChange = (field: keyof Meta, value: string) => {
    if (editedMeta) {
      const updatedMeta = { ...editedMeta, [field]: value };
      if (field === "valorTotal" || field === "valorAtual") {
        const valorAtual = parseFloat(String(updatedMeta.valorAtual) || "0");
        const valorTotal = parseFloat(String(updatedMeta.valorTotal) || "0");
        updatedMeta.porcentagem = calculatePercentage(valorAtual, valorTotal);
      }
      setEditedMeta(updatedMeta);
    }
  };

  useEffect(() => {
    if (editedMeta) {
      const valorAtual = parseFloat(String(editedMeta.valorAtual) || "0");
      const valorTotal = parseFloat(String(editedMeta.valorTotal) || "0");
      const porcentagem = calculatePercentage(valorAtual, valorTotal);
      if (porcentagem !== editedMeta.porcentagem) {
        setEditedMeta({ ...editedMeta, porcentagem });
      }
    }
  }, [editedMeta?.valorAtual, editedMeta?.valorTotal]);

  const handleEdit = (index: number) => {
    setIsEditing(index);
    setEditedMeta(metas[index]);
  }

  const handleSave = async () => {
    if (editedMeta && isEditing !== null) {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log("Token não encontrado. Redirecionando para login.");
                navigation.navigate('Login');
                return;
            }

            // Formatar a data no formato DD-MM-AAAA antes de enviar
            const metaComDataFormatada = {
                ...editedMeta,
                nome: editedMeta.nome, // Certifique-se de incluir o nome editado
                data: editedMeta.data
                    ? editedMeta.data.split("-").reverse().join("-") // ISO (YYYY-MM-DD) para DD-MM-AAAA
                    : "",
            };

            const dadosAtualizados: Meta = {
                ...metas[isEditing], // Mantém os valores antigos
                ...metaComDataFormatada, // Sobrescreve com os valores editados e a data formatada
            };

            // Enviar a requisição PUT ao backend
            const response = await axios.put(
                `${API_URL}/atualizar/meta/${editedMeta.id}`,
                dadosAtualizados,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedMeta = response.data;

            // Atualiza apenas a meta específica no estado
            const updatedMetas = metas.map((meta, index) =>
                index === isEditing ? updatedMeta : meta
            );

            setMetas(updatedMetas);
            setIsEditing(null);
            setEditedMeta(null);

            setModalVisible(true); // Exibir modal de sucesso
        } catch (error) {
            console.error("Erro ao salvar meta:", error);
        }
    }
  };

  const handleCancel = () => {
    setEditedMeta(null);
    setIsEditing(null);
  }

  const handleDelete = (meta: Meta) => {
    setMetaToDelete(meta);
    setConfirmDeleteVisible(true);
  }

  const confirmDelete = async () => {
    if (metaToDelete) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado. Redirecionando para login.");
          navigation.navigate('Login');
          return;
        }

        await axios.delete(`${API_URL}/excluir/meta/${metaToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedMetas = metas.filter((meta) => meta.id !== metaToDelete.id);
        setMetas(updatedMetas);
        setMetaToDelete(null);
        setConfirmDeleteVisible(false);
        setModalVisible(true);
      } catch (error) {
        console.error("Erro ao deletar meta:", error);
      }
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false);
  }

  const handleCloseConfirmModal = () => {
    setIsConfirmDelete(false);
    setMetaToDelete(null);
  }

  const formatarData = (dataString: string): string => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false); // Fechar o DateTimePicker
    if (selectedDate && editedMeta) {
        const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato ISO para backend
        setEditedMeta({ ...editedMeta, data: formattedDate });
    }
  };

  return (
    <Layout>
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
      >
        <View style={styles.titulo}>
          <Text style={styles.tituloText}>Painel de Metas</Text>
        </View>
        {metas.map((meta: Meta, index: number) => (
          <View key={index} style={styles.card}>
            {isEditing === index ? (
              <View>
                  <Text style={styles.cardTitle}>Nome</Text>
                  <TextInput 
                    style={styles.cardText} 
                    value={editedMeta ? editedMeta?.nome: ''}
                    onChangeText={(text) => handleInputChange("nome", text)}
                  />
                  <Text style={styles.cardTitle}>Valor Total</Text>
                  <TextInput
                    style={styles.cardText}
                    value={editedMeta ? String(editedMeta?.valorTotal) : ""}
                    onChangeText={(text) => handleInputChange("valorTotal", text)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.cardTitle}>Valor Atual</Text>
                  <TextInput
                    style={styles.cardText}
                    value={editedMeta ? String(editedMeta?.valorAtual) : ""}
                    onChangeText={(text) => handleInputChange("valorAtual", text)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.cardTitle}>Data</Text>
                  <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                      <Text style={styles.dateText}>
                          {editedMeta?.data ? formatarData(editedMeta.data) : "Selecionar data"}
                      </Text>
                  </TouchableOpacity>
                  {isDatePickerVisible && (
                      <DateTimePicker
                          value={new Date(editedMeta?.data || new Date())}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                      />
                  )}
                  <ProgressBar progress={meta.porcentagem} />
                  <View>
                    <Text style={styles.porcentagem}>{formatarPorcentagem(meta.porcentagem)}%</Text>
                  </View>
                  <View style={styles.botoes}>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            ):(
              <View>
                  <Text style={styles.cardTitle}>{meta.nome}</Text>
                  <Text style={styles.cardProgress}>{formatarData(meta.data)}</Text>
                  <ProgressBar progress={meta.porcentagem} />
                  <View>
                    <Text style={styles.porcentagem}>{formatarPorcentagem(meta.porcentagem)}%</Text>
                  </View>
                  <View style={styles.botoes}>
                    <View style={styles.btn}>
                      <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                        <Icon name='edit' size={24} color="#000" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(meta)} style={styles.deleteButton}>
                        <Icon name='trash' size={24} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
            )}
            
          </View>
        ))}
        {/* Botão fixado no final do conteúdo */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CadastrarMetas")}
            style={styles.addButton}
          >
            <Icon name="plus-circle" size={40} color="#000" />
          </TouchableOpacity>
        </View>

        <ModalSucesso 
          nome="Meta"
          visible={modalVisible} 
          tipoSucesso={`A meta foi atualizada com sucesso!`} 
          onClose={handleCloseModal} 
        />
        <ModalConfirmacaoDelete 
          visible={confirmDeleteVisible} 
          onClose={handleCloseConfirmModal} 
          onConfirm={confirmDelete} 
          nome={metaToDelete ? metaToDelete.nome : ''} 
        />
      </KeyboardAwareScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: "100%",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 80, // Para evitar sobreposição com o botão
  },
  titulo: {
    margin: "7%",
    marginBottom: "10%",
  },
  tituloText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "regular",
    color: "#333",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardProgress: {
    fontSize: 16,
    color: "#888",
    marginVertical: 10,
  },
  dateText: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "regular",
    color: "#333",
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 20,
    alignItems: 'center',
    width: '65%',
    marginRight: 0,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  editButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  deleteButton: {
    justifyContent: 'flex-end',
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
  porcentagem: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
  },
  addButtonContainer: {
    marginTop: 20,
    marginBottom: 0,
  },
  addButton: {
    position: "relative",
    bottom: 0,
    left: 160,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});
