import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Layout from "../../components/layout";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../api";
import DonutChart from "../../components/donutChart";
import { useNavigation } from "@react-navigation/native";
import homeIcon from "../../assets/homeicon.png";
import pencilIcon from "../../assets/pencil-dollar.png";
import folderIcon from "../../assets/folder-open.png";
import { RootStackParamList } from "../../routes";
import { StackNavigationProp } from "@react-navigation/stack";

// Definindo o tipo do orçamento
interface Orcamento {
  maior: string;
  menor: string;
  porcentagem: string;
  totalDespesas: number;
  totalReceitas: number;
  dadosGrafico: { label: string; value: number; color: string }[]; // Dados para o gráfico
}

export default function Home() {
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [descricaoPorcentagem, setDescricaoPorcentagem] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchOrcamento = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        setLoading(false);
        return;
      }

      const cachedData = await AsyncStorage.getItem("orcamento");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDescricaoPorcentagem(
          `As ${parsedData.maior} equivalem a ${parsedData.porcentagem}% das ${parsedData.menor}.`
        );
        setOrcamento(parsedData);
      }

      const response = await axios.get(`${API_URL}/orcamento/grafico`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      const { totalDespesas, totalReceitas, porcentagem } = response.data;
      
      // Corrigir o cálculo da porcentagem de despesas em relação às receitas
      const maior = totalDespesas > totalReceitas ? "despesas" : "receitas";
      const menor = totalDespesas > totalReceitas ? "receitas" : "despesas";

      const percentualDespesas = (totalDespesas / totalReceitas) * 100; // Porcentagem de despesas em relação às receitas

      const data = {
        totalDespesas,
        totalReceitas,
        maior,
        menor,
        porcentagem: percentualDespesas.toFixed(2), // Ajusta a porcentagem para despesas
        dadosGrafico: [
          { label: "Receitas", value: totalReceitas, color: "#79dd7e" },
          { label: "Despesas", value: totalDespesas, color: "#e15e6e" },
        ],
      };

      await AsyncStorage.setItem("orcamento", JSON.stringify(data));

      setDescricaoPorcentagem(`As ${maior} equivalem a ${percentualDespesas.toFixed(2)}% das ${menor}.`);
      setOrcamento(data);
    } catch (error) {
      console.error("Erro ao buscar dados do orçamento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrcamento();
  }, []);

  const handleNavigation = (page: keyof RootStackParamList) => {
    navigation.navigate(page);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <LinearGradient
          colors={["#a64ac9", "#6b6bbd", "#3d9be9", "#41e8d1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          <SafeAreaView style={styles.safeAreaContainer}>
            {/* Gráfico de Receitas e Despesas */}
            {orcamento && !loading && (
              <View style={styles.chartContainer}>
                <DonutChart
                  showLabels={false}
                  data={orcamento.dadosGrafico}
                />
                <View style={styles.chartTextContainer}>
                  <Text style={styles.textTop}>Despesas</Text>
                  <Text style={styles.textBottom}>{orcamento.porcentagem}%</Text>
                </View>
              </View>
            )}

            {/* Carregando Spinner */}
            {loading && <ActivityIndicator size="large" color="#3d9be9" />}
          </SafeAreaView>
        </LinearGradient>

        {/* Texto de Boas-vindas e Descrição */}
        <View style={styles.container1}>
          <Text style={styles.textinho1}>Bem-vindo(a) ao LiFin!</Text>
          <Text style={styles.textinho}>Sobre:</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              O LiFin é um aplicativo de finanças pessoais que organiza receitas, despesas e orçamentos de
              forma simples. Ele oferece gráficos interativos e relatórios detalhados para ajudar no controle
              financeiro. Ideal para quem busca tomar decisões financeiras mais informadas e alcançar seus
              objetivos.
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleNavigation("CadastroDespesasReceitas")}
            >
              <Image source={pencilIcon} style={styles.cardIcon} />
              <Text style={styles.cardText}>Anotar Despesas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => handleNavigation("PainelDespesasReceitas")}
            >
              <Image source={folderIcon} style={styles.cardIcon} />
              <Text style={styles.cardText}>Painel de Despesas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Cor de fundo mais suave para a página
  },
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 80, 
    marginTop: 0, 
  },
  gradientContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  safeAreaContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  chartContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
    position: "relative",
  },
  chartTextContainer: {
    position: "absolute",
    top: "60%",
    left: "48%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
  },
  textTop: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  textBottom: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  descriptionContainer: {
    padding: 10,
    alignItems: "center",
    marginTop: 30, // Aumentei o espaçamento para dar destaque ao texto
    borderRadius: 10,
    backgroundColor: "#fff", // Cor de fundo para destacar a descrição
    shadowColor: "#000", // Adicionei sombra para dar profundidade
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra visível no Android
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    fontWeight: "400",
    textAlign: "center", // Centraliza o texto para melhor visualização
    maxWidth: 350, // Limita a largura do texto
  },
  textinho: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
  },
  textinho1: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 0,
    marginBottom: 15,
    color: "#333",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 130,
  },
  card: {
    width: 120,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});