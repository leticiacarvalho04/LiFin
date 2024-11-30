import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DonutChartProps {
  url: string; // URL da API
}

const DonutChart: React.FC<DonutChartProps> = ({ url }) => {
  const size = 200; // Tamanho do gráfico
  const strokeWidth = 30; // Espessura do anel
  const radius = (size - strokeWidth) / 2; // Raio do círculo
  const circumference = 2 * Math.PI * radius; // Circunferência

  const [data, setData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token não encontrado. Redirecionando para login.");
            return;
        }
        setLoading(true);
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data); // A API deve retornar algo como: [{ label: 'Renda fixa', value: 77, color: '#3d9be9' }]
      } catch (error) {
        console.error('Erro ao buscar dados para o gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

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

                const circle = (
                  <Circle
                    key={index}
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
                );

                startAngle += slice.value;
                return circle;
              })}
            </G>
          </Svg>
          <View style={styles.labels}>
            {data.map((slice, index) => (
              <Text key={index} style={[styles.label, { color: slice.color }]}>
                {slice.label}: {slice.value}%
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7', // Fundo cinza claro
  },
  labels: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DonutChart;
