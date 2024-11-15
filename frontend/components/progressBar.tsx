import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number; 
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const progressValue = progress / 100; // Converte a porcentagem em um valor de 0 a 1

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: `${progressValue * 100}%` }, // Define a largura da barra de progresso
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '90%',
    backgroundColor: '#3d9be9',
    borderRadius: 10,
  },
});

export default ProgressBar;
