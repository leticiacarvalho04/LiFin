import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../routes';

interface SucessModalProps {
  onClose?: () => void;
  nome: string;
  tipoSucesso: string;
  visible: boolean; 
  onSubmit?: () => void;
  onReset?: () => void;
  onRedirect?: string;
}

const ModalSucesso: React.FC<SucessModalProps> = ({onClose, nome, tipoSucesso, visible, onRedirect}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleOk = () => {
    if (onRedirect) {
      console.log("Redirecionando para:", onRedirect);
      navigation.navigate(onRedirect as keyof RootStackParamList);
    }
    if (onClose) {
      onClose();
    }
  };

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
            <Icon name="check-circle" size={28} color="black" />
            <Text style={styles.successMessage}>
              {nome} {tipoSucesso} com sucesso!
            </Text>
          </View>

          <Text style={styles.additionalMessage}>
            {nome} foi {tipoSucesso} com sucesso!
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleOk} style={styles.okButton}>
              <Text style={styles.okButtonText}>OK</Text>
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
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 7, // Adicione padding se necessário
    width: '100%',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginRight: 14,
    marginTop: 5,
  },
  additionalMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 16,
  },
  okButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  okButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ModalSucesso;