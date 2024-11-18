import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../api";
import Layout from "../../components/layout";
import ModalSucesso from "../../components/modalSucesso";
import axios from "axios";

export default function CadastrarMetas() {
  const initialValues = {
    nome: "",
    valorTotal: "",
    valorAtual: "",
    data: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [isEmpty, setIsEmpty] = useState<{ [key: string]: boolean }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const resetForm = () => {
    setFormValues(initialValues);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
    if (field === "valorAtual" || field === "valorTotal") {
      validateValue(field, value);
    }
  };

  const validateValue = (field: string, value: string) => {
    const isValid = /^\d+(\.\d{1,2})?$/.test(value);
    setIsEmpty((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
  };

  const validateFields = () => {
    const emptyFields = {
      nome: !formValues.nome.trim(),
      valorTotal: !/^\d+(\.\d{1,2})?$/.test(formValues.valorTotal),
      valorAtual: !/^\d+(\.\d{1,2})?$/.test(formValues.valorAtual),
      data: !formValues.data.trim(),
    };
    setIsEmpty(emptyFields);
    return Object.values(emptyFields).every((isValid) => !isValid);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      handleInputChange("data", formattedDate);
    }
    setShowDatePicker(false);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Alterado para o formato DD-MM-YYYY
  };  

  const handleCadastro = async () => {
    try {
      // Recuperando o token do AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
  
      if (!token || !userId) {
        console.error("Token ou UserId não encontrado.");
        return;
      }
  
      const payload = {
        nome: formValues.nome,
        valorTotal: parseFloat(formValues.valorTotal),
        valorAtual: parseFloat(formValues.valorAtual),
        data: formValues.data,
        userId,
      };
  
      // Envia os dados para a API
      const response = await axios.post(
        `${API_URL}/cadastro/meta`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Verificando a resposta da API
      if (response.status === 201) {
        console.log("Meta cadastrada com sucesso:", response.data);
        setModalVisible(true);
        navigation.navigate("Metas");
      } else {
        console.error("Erro ao cadastrar meta: Status", response.status, response.data);
      }
    } catch (error: any) {
      // Trate o erro de forma mais detalhada
      if (error.response) {
        // Se houver resposta de erro do servidor
        console.error("Erro ao cadastrar meta:", error.response.status, error.response.data);
      } else {
        console.error("Erro ao cadastrar meta:", error.message);
      }
    }
  };  

  return (
    <Layout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.titulo}>
          <Text style={styles.tituloText}>Cadastro de Metas</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={formValues.nome}
            onChangeText={(text) => handleInputChange("nome", text)}
          />
          {isEmpty.nome && <Text style={styles.errorText}>Campo obrigatório</Text>}

          <TextInput
            style={styles.input}
            placeholder="Valor total"
            value={formValues.valorTotal}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("valorTotal", text)}
          />
          {isEmpty.valorTotal && <Text style={styles.errorText}>Valor inválido</Text>}

          <TextInput
            style={styles.input}
            placeholder="Valor atual"
            value={formValues.valorAtual}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("valorAtual", text)}
          />
          {isEmpty.valorAtual && <Text style={styles.errorText}>Valor inválido</Text>}

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{formValues.data || "Selecione a data"}</Text>
          </TouchableOpacity>
          {isEmpty.data && <Text style={styles.errorText}>Campo obrigatório</Text>}

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={new Date()}
              onChange={handleDateChange}
              display="default"
            />
          )}

          <TouchableOpacity style={styles.btn} onPress={handleCadastro}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>

          {modalVisible && (
            <ModalSucesso
              nome={"Meta"}
              tipoSucesso={"cadastrada"}
              onClose={closeModal}
              visible={modalVisible}
              onRedirect={"Metas"}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
    maxWidth: 400,
    justifyContent: "center",
    marginVertical: "5%",
  },
  titulo: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: "8%",
  },
  tituloText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  btn: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
