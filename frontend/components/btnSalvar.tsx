import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalSucesso from './modalSucesso';
import axios from 'axios';
import { API_URL } from '../api';

interface Props {
  nome: string;
  tipoSucesso: string;
  onReset?: () => void;
  rota: string;
  formValues: any;
}

export default function BtnSalvar(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    setModalVisible(true);
    const dataToSend = {
      nome: props.formValues.Nome,
      categoriaId: props.formValues.Categoria,
      valor: props.formValues.Valor,
      data: props.formValues.Data, // Aqui estamos utilizando a data já formatada no formato DD-MM-YYYY
      descricao: props.formValues.Descricao,
    };
    console.log('Dados a serem enviados:', dataToSend);

    try {
      const response = await axios.post(`${API_URL}/${props.rota}`, dataToSend);
      if (response.status === 200 || 201) {
        props.onReset && props.onReset();
      } else {
        console.error('Erro na resposta:', response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao enviar dados:', error.response?.data || error.message);
      } else {
        console.error('Erro ao enviar dados:', error);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (props.onReset) {
      props.onReset();
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <View style={styles.btnContent}>
          <Text style={styles.btnText}>Salvar</Text>
        </View>
      </TouchableOpacity>

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
    marginVertical: '8%',
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
