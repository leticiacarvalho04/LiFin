import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Layout from "../../components/layout";
import ProgressBar from "../../components/progressBar";
import axios from "axios";
import { API_URL } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { Meta } from "../../types/metas";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function PainelMetas() {
  const [painelValues, setPainelValues] = useState<Meta[]>([]);
  const [metas, setMetas] = useState<any[]>([]); // Lista de metas
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

      const despesasFirestore = response.data;
      const storedMetasJSON = await AsyncStorage.getItem("metas");
      const storedMetas = storedMetasJSON ? JSON.parse(storedMetasJSON) : [];

      if (
        JSON.stringify(despesasFirestore) !== JSON.stringify(storedMetas) ||
        storedMetas.length === 0
      ) {
        await AsyncStorage.setItem("metas", JSON.stringify(despesasFirestore));

        const metasFormatadas = despesasFirestore.map((meta: Meta): Meta => ({
          ...meta,
          data: meta.data
            ? meta.data.split("T")[0].split("-").reverse().join("-")
            : "",
        }));

        setPainelValues(metasFormatadas);
        setMetas(despesasFirestore);
      } else {
        setPainelValues(storedMetas);
        setMetas(storedMetas);
      }
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const formatarData = (dataString: string): string => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
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
        {metas.map((meta) => (
          <View key={meta.id} style={styles.card}>
            <Text style={styles.cardTitle}>{meta.nome}</Text>
            <Text style={styles.cardProgress}>{formatarData(meta.data)}</Text>
            <ProgressBar progress={meta.porcentagem} />
            <View>
              <Text style={styles.porcentagem}>{meta.porcentagem}%</Text>
            </View>
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
  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
  },
  cardProgress: {
    fontSize: 16,
    color: "#888",
    marginVertical: 10,
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
