import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Layout from "../../components/layout";
import DonutChart from "../../components/donutChart";
import { API_URL } from "../../api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Orcamento } from "../../types/orcamento";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import Icon from "react-native-vector-icons/Feather";

export default function PainelOrcamentos() {
  const [orcamento, setOrcamento] = useState<Orcamento>();
  const [descricaoPorcentagem, setDescricaoPorcentagem] = useState<string>("");
  const [graficosGastosFixos, setGraficosGastosFixos] = useState<any[]>([]); // Para armazenar múltiplos gráficos
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  // Função para buscar o primeiro gráfico (receitas e despesas)
  const fetchOrcamento = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/orcamento/grafico`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { totalDespesas, totalReceitas, porcentagem } = response.data;

      const maior = totalDespesas > totalReceitas ? "despesas" : "receitas";
      const menor = totalDespesas > totalReceitas ? "receitas" : "despesas";
      const descricao = `As ${maior} equivalem a ${porcentagem.toFixed(
        2
      )}% das ${menor}.`;

      setDescricaoPorcentagem(descricao);
      setOrcamento({
        ...response.data,
        porcentagem: porcentagem.toFixed(2), // Ajuste aqui para arredondar a porcentagem
      });
    } catch (error) {
      console.error("Erro ao buscar dados do orçamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraficosGastosFixos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        return;
      }

      const response = await axios.get(`${API_URL}/orcamento/grafico/gastos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      if (data?.orcamentos && Array.isArray(data.orcamentos)) {
        const graficosFormatados = data.orcamentos.map((orcamento: any) => {
          const gastosFixosGrafico = orcamento.gastosFixos.map((gasto: any) => {
            return {
              label: gasto.nome,
              value: parseFloat(gasto.porcentagem), // Usando diretamente a porcentagem fornecida
              color: gerarCorFixa(),
            };
          });
          return { id: orcamento.id, gastosFixosGrafico };
        });
        setGraficosGastosFixos(graficosFormatados); // Agora temos os gráficos com as porcentagens fornecidas
      } else {
        console.error(
          "O formato dos dados do gráfico de gastos fixos está incorreto:",
          response.data
        );
        setGraficosGastosFixos([]); // Sem dados, setando como array vazio
      }
    } catch (error) {
      console.error(
        "Erro ao buscar dados dos gráficos de gastos fixos:",
        error
      );
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchGraficosGastosFixos();
      fetchOrcamento();
    }
  }, [isFocused]);

  const coresFixas = ["#a64ac9", "#6b6bbd", "#41e8d1", "#3d9be9"];
  let indiceCor = 0;
  const gerarCorFixa = () => {
    const cor = coresFixas[indiceCor];
    indiceCor = (indiceCor + 1) % coresFixas.length;
    return cor;
  };

  if (loading) {
    return (
      <Layout>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#3d9be9" />
        </SafeAreaView>
      </Layout>
    );
  }

  if (!orcamento) {
    return (
      <Layout>
        <SafeAreaView style={styles.container}>
          <Text>Nenhum orçamento encontrado.</Text>
        </SafeAreaView>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View>
          <Text style={styles.title}>Painel de Orçamentos</Text>
        </View>
        <SafeAreaView style={styles.container}>
          {/* Primeiro Gráfico: Receitas e Despesas */}
          <Text style={styles.chartTitle}>Gráfico de Receitas e Despesas</Text>
          <DonutChart
            showLabels={true}
            data={[
              {
                label: "Receita",
                value: 100 - parseFloat(orcamento.porcentagem),
                color: "#41e8d1",
              }, // Agora a receita vem com o valor restante
              {
                label: "Despesa",
                value: parseFloat(orcamento.porcentagem),
                color: "#3d9be9",
              }, // E a despesa com o valor original
            ]}
          />

          {/* Segundo Gráfico: Gastos Fixos, um para cada orçamento */}
          {graficosGastosFixos.length > 0 ? (
            graficosGastosFixos.map((grafico, index) => (
              <View key={grafico.id}>
                <Text style={styles.chartTitle}>
                  Gastos fixos do Orçamento {index + 1}
                </Text>
                <DonutChart
                  showLabels={true}
                  data={grafico.gastosFixosGrafico.map((item: any) => ({
                    label: item.label,
                    value: parseFloat(item.value.toString()), // Usando a porcentagem do gráfico
                    color: item.color,
                  }))}
                />
              </View>
            ))
          ) : (
            <Text>Sem dados para exibir no gráfico de gastos fixos</Text>
          )}
        </SafeAreaView>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("CadastrarOrcamento")}
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: 20,
  },
  chartTitle: {
    fontSize: 15,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20, // Ajuste de padding para que o conteúdo não grude no fim
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
  },
});
