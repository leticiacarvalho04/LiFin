import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { RootStackParamList } from '../routes';

const DonutChart = () => {
  const size = 200; // Tamanho do gráfico
  const strokeWidth = 30; // Espessura do anel
  const radius = (size - strokeWidth) / 2; // Raio do círculo
  const circumference = 2 * Math.PI * radius; // Circunferência
  const data = [
    { label: 'Renda fixa', value: 77, color: '#3d9be9' }, // Roxo
    { label: 'Extra', value: 23, color: '#41e8d1' }, // Rosa
  ];
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const total = data.reduce((acc, item) => acc + item.value, 0);

  let startAngle = 0;

  return (
    <View style={styles.container}>
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
