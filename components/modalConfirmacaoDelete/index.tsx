import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

interface DeleteModalProps {
  onClose: () => void;
  nome: string;
}

const ModalConfirmacaoDelete: React.FC<DeleteModalProps> = ({ onClose, nome }) => {
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="x" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.messageContainer}>
        <Icon name="alert-triangle" size={28} color="black" />
        <Text style={styles.confirmationMessage}>
          Deseja mesmo excluir {nome}?
        </Text>
      </View>

      <Text style={styles.additionalMessage}>
        Tem certeza que deseja excluir o {nome}? Essa ação não poderá ser desfeita.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClose} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalConfirmacaoDelete;
