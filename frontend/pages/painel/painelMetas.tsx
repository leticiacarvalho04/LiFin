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
import DropdownMetas from "../../components/dropdownMeta";

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

      const metasFirestore = response.data.map((meta: Meta): Meta => ({
        ...meta,
        data: meta.data ? meta.data.split("T")[0].split("-").reverse().join("-") : "",
      }));

      setMetas(metasFirestore);
      setPainelValues(metasFirestore);
      await AsyncStorage.setItem("metas", JSON.stringify(metasFirestore));
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
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

  useEffect(() => {
    if (isFocused) {
      fetchMetas();
    }
  }, [isFocused]);

  const handleDelete = async (meta: Meta) => {
    setMetaToDelete(meta);
    setConfirmDeleteVisible(true);
  };

  const handleEdit = (index: number) => {
    setIsEditing(index);
    setEditedMeta(metas[index]);
  };

  const handleSave = async () => {
    if (editedMeta && isEditing !== null) {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");  // Supondo que o userId está armazenado no AsyncStorage
  
        if (!token || !userId) {
          console.log("Token ou userId não encontrado. Redirecionando para login.");
          navigation.navigate("Login");
          return;
        }
  
        // Formatar a data no formato DD-MM-AAAA antes de enviar
        const metaComDataFormatada = {
          ...editedMeta,
          nome: editedMeta.nome, // Certifique-se de incluir o nome editado
          // Garantir que a data esteja no formato DD-MM-AAAA
          data: editedMeta.data
            ? editedMeta.data.split("-").reverse().join("-") // De ISO (YYYY-MM-DD) para DD-MM-AAAA
            : "",
          userId,  // Incluir userId no objeto enviado
        };
  
        // Enviar a requisição PUT ao backend
        const response = await axios.put(
          `${API_URL}/atualizar/meta/${editedMeta.id}`,
          editedMeta,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
  
        // Atualiza a meta específica no estado
        const updatedMetas = metas.map((meta, index) =>
          index === isEditing ? { ...meta, ...metaComDataFormatada } : meta
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

  const confirmDelete = async () => {
    if (metaToDelete) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado. Redirecionando para login.");
          navigation.navigate("Login");
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
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmDelete(false);
    setMetaToDelete(null);
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
          <Text style={styles.tituloText}>Minhas metas financeiras</Text>
        </View>
        {metas.map((meta, index) => (
          <DropdownMetas
            key={index}
            meta={meta}
            isEditing={isEditing === index}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(meta)}
            onSave={handleSave}
            onCancel={() => setIsEditing(null)}
            onInputChange={handleInputChange}
            onDateChange={(date) => handleInputChange("data", date)}
          />
        ))}

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
      <TouchableOpacity
        onPress={() => navigation.navigate("CadastrarMetas")}
        style={styles.addButton}
      >
        <Icon name="plus-circle" size={40} color="#000" />
      </TouchableOpacity>
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
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
  },
});
