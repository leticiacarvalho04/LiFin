import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalSucesso from './modalSucesso';

interface Props{
    nome: string;
    tipoSucesso: string;
}

export default function BtnSalvar(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    setModalVisible(true); // Exibe o modal ao clicar em salvar
  };

  const closeModal = () => {
    setModalVisible(false); // Fecha o modal ao clicar no botão OK
  };

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <View style={styles.btnContent}>
          <Text style={styles.btnText}>Salvar</Text>
        </View>
      </TouchableOpacity>

      {/* Exibe o ModalSucesso dentro de um <View> */}
      {modalVisible && (
        <ModalSucesso
          nome={props.nome}
          tipoSucesso={props.tipoSucesso}
          onClose={closeModal}
          visible={modalVisible}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    marginLeft: 5,
  },
});
