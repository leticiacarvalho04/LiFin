import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;  // Adicionando a prop para confirmação
  nome: string;
  visible: boolean;
}

const ModalConfirmacaoDelete: React.FC<DeleteModalProps> = ({ onClose, onConfirm, nome, visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
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
            <TouchableOpacity onPress={onConfirm} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fundo semi-transparente
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // Fundo branco do modal
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginRight: 16,
  },
  additionalMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#A164E3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});


export default ModalConfirmacaoDelete;
