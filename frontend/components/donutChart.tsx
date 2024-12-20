import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DonutChartProps {
  url?: string; // URL da API
  data?: { label: string; value: number; color: string }[]; 
  showLabels?: boolean; // Prop para controlar a exibição dos rótulos
}

const DonutChart: React.FC<DonutChartProps> = ({ url, data: propData, showLabels = true }) => {
  const size = 200; // Tamanho do gráfico
  const strokeWidth = 30; // Espessura do anel
  const radius = (size - strokeWidth) / 2; // Raio do círculo
  const circumference = 2 * Math.PI * radius; // Circunferência

  const [data, setData] = useState<{ label: string; value: number; color: string }[]>(propData || []);
  const [loading, setLoading] = useState(!propData);

  useEffect(() => {
    if (propData) return;

    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado. Redirecionando para login.");
          return;
        }
        setLoading(true);
        const response = await axios.get(url!, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, [url, propData]);

  const total = data.reduce((acc, item) => acc + item.value, 0); // Soma total dos valores
  let startAngle = 0; // Ângulo inicial para o primeiro slice

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3d9be9" />
      ) : (
        <>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {data.map((slice, index) => {
                const percentage = (slice.value / total) * 100;
                const arcLength = (circumference * percentage) / 100;

                const midAngle = startAngle + (slice.value / total) * 360; // Ângulo médio do slice
                const textX = size / 2 + (radius * 1.5) * Math.cos((midAngle * Math.PI) / 180); // Ajuste para colocar o texto mais próximo da borda
                const textY = size / 2 + (radius * 1.5) * Math.sin((midAngle * Math.PI) / 180); // Ajuste para colocar o texto mais próximo da borda

                // Calcular a rotação do texto para mantê-lo horizontal
                const rotationAngle = midAngle > 180 ? midAngle + 180 : midAngle;

                const circle = (
                  <React.Fragment key={index}>
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={slice.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                      strokeLinecap="round"
                      fill="transparent"
                      rotation={(startAngle / total) * 360}
                      origin={`${size / 2}, ${size / 2}`}
                    />
                  </React.Fragment>
                );

                startAngle += slice.value;
                return circle;
              })}
            </G>
          </Svg>
          {showLabels && (
            <View style={styles.labels}>
              {data.map((slice, index) => (
                <Text key={index} style={[styles.label, { color: slice.color }]}>
                  {slice.label}: {slice.value}%
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  labels: {
    marginTop: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DonutChart;
