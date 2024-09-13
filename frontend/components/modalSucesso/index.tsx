import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

interface SucessModalProps {
  onClose: () => void;
  nome: string;
  tipoSucesso: string;
}

const ModalDeletado: React.FC<SucessModalProps> = ({ onClose, nome, tipoSucesso }) => {
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="x" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.messageContainer}>
        <Icon name="check-circle" size={28} color="black" />
        <Text style={styles.successMessage}>
          {nome} {tipoSucesso} com sucesso!
        </Text>
      </View>

      <Text style={styles.additionalMessage}>
        {nome} foi {tipoSucesso} com sucesso!
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.okButton}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalDeletado;
