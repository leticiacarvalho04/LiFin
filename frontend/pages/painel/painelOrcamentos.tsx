import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Layout from "../../components/layout";
import DonutChart from "../../components/donutChart";
import { API_URL } from "../../api";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Orcamento } from "../../types/orcamento";

export default function PainelOrcamentos() {
    const [orcamento, setOrcamento] = useState<Orcamento>();
    const [loading, setLoading] = useState(true);
    const [descricaoPorcentagem, setDescricaoPorcentagem] = useState<string>("");

    useEffect(() => {
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

                // Define a descrição com base nos valores
                const maior = totalDespesas > totalReceitas ? "despesas" : "receitas";
                const menor = totalDespesas > totalReceitas ? "receitas" : "despesas";
                const descricao = `As ${maior} equivalem a ${porcentagem.toFixed(
                    2
                )}% das ${menor}.`;

                setDescricaoPorcentagem(descricao);
                setOrcamento({
                    ...response.data,
                    porcentagem: porcentagem.toFixed(2),
                });
            } catch (error) {
                console.error("Erro ao buscar dados do orçamento:", error);
            } finally {
                setLoading(false); // Garante que o carregamento para mesmo em caso de erro
            }
        };

        fetchOrcamento();
    }, []);

    if (loading) {
        return (
            <Layout>
                <SafeAreaView style={styles.container}>
                    <Text>Carregando...</Text>
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
            <View>
                <Text style={styles.title}>Painel de Orçamentos</Text>
            </View>
            <SafeAreaView style={styles.container}>
                <Text style={styles.chartTitle}>Porcentagem Geral</Text>
                <DonutChart
                    data={[
                        {
                            label: "Receita",
                            value: parseFloat(orcamento.porcentagem),
                            color: "#41e8d1",
                        },
                        {
                            label: "Despesa",
                            value: 100 - parseFloat(orcamento.porcentagem),
                            color: "#3d9be9",
                        },
                    ]}
                />
            </SafeAreaView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginTop: 20,
        fontWeight: "bold",
        color: "#6b6bbd", // Cor específica para a descrição
        textAlign: "center",
    },
});
