import React, { useState, useEffect } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Layout from "../../components/layout";
import ModalSucesso from "../../components/modalSucesso";
import { API_URL } from "../../api";

export default function CadastrarOrcamento() {
  const initialValues = {
    valorTotal: "",
    rendaExtra: "",
    gastosFixosId: [] as string[], // Lista de ids de gastos fixos selecionados
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [gastosFixos, setGastosFixos] = useState<any[]>([]); // Para armazenar os gastos fixos
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  // Função para carregar os gastos fixos
  const loadGastosFixos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        return;
      }
      const response = await axios.get(`${API_URL}/gastos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGastosFixos(response.data); // Espera que a resposta seja uma lista de gastos fixos
    } catch (error) {
      console.error("Erro ao carregar gastos fixos", error);
    }
  };

  useEffect(() => {
    loadGastosFixos(); // Carrega os gastos fixos quando o componente for montado
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (id: string) => {
    const { gastosFixosId } = formValues;
    if (gastosFixosId.includes(id)) {
      // Se já está selecionado, remove da lista
      setFormValues({
        ...formValues,
        gastosFixosId: gastosFixosId.filter((gastoId) => gastoId !== id),
      });
    } else {
      // Caso contrário, adiciona à lista
      setFormValues({
        ...formValues,
        gastosFixosId: [...gastosFixosId, id],
      });
    }
  };

  const handleCadastro = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token ou UserId não encontrado.");
        return;
      }

      const payload = {
        valorTotal: parseFloat(formValues.valorTotal),
        rendaExtra: parseFloat(formValues.rendaExtra),
        userId,
        gastosFixosId: formValues.gastosFixosId,
      };

      // Envia os dados para a API
      const response = await axios.post(`${API_URL}/cadastro/orcamento`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        console.log("Orçamento cadastrado com sucesso:", response.data);
        setModalVisible(true);
        navigation.navigate("Orcamentos");
      } else {
        console.error("Erro ao cadastrar orçamento:", response.status);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao cadastrar orçamento:", error.message);
      } else {
        console.error("Erro ao cadastrar orçamento:", error);
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
          <Text style={styles.tituloText}>Cadastro de Orçamento</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Valor Total"
            value={formValues.valorTotal}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("valorTotal", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Renda Extra"
            value={formValues.rendaExtra}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange("rendaExtra", text)}
          />

          <Text style={styles.label}>Gastos Fixos</Text>
          <ScrollView style={styles.checkboxContainer}>
            {gastosFixos.map((gasto) => (
              <View key={gasto.id} style={styles.checkboxWrapper}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => handleCheckboxChange(gasto.id)}
                >
                  <Text style={styles.checkboxText}>
                    {formValues.gastosFixosId.includes(gasto.id)
                      ? "✔️"
                      : "⭕"} {gasto.nome}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.btn} onPress={handleCadastro}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>

          {modalVisible && (
            <ModalSucesso
              nome={"Orçamento"}
              tipoSucesso={"cadastrado"}
              onClose={() => setModalVisible(false)}
              visible={modalVisible}
              onRedirect={"Orcamentos"}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
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
  label: {
    marginBottom: 10,
    fontWeight: "bold",
  },
});
