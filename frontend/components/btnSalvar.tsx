import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalSucesso from './modalSucesso';
import axios from 'axios';

interface Props {
  nome: string;
  tipoSucesso: string;
  onReset?: () => void; // Função para resetar o formulário
  rota: string; // Rota para enviar os dados
  formValues: any; // Valores do formulário
}

export default function BtnSalvar(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    setModalVisible(true);
    const dataToSend = {
      nome: props.formValues.Nome,
      categoriaId: props.formValues.Categoria,
      valor: props.formValues.Valor,
      data: props.formValues.Data,
      descricao: props.formValues.Descricao,
      created_at: new Date().toLocaleDateString('pt-BR'),
      updated_at: new Date().toLocaleDateString('pt-BR'),
    };
  
    try {
      const response = await axios.post(`http://192.168.17.226:3000/${props.rota}`, dataToSend);
      if (response.status === 200) {
        props.onReset && props.onReset(); // Limpa o formulário após sucesso
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (props.onReset) {
      props.onReset(); // Chama a função para resetar os valores do formulário
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
    marginVertical: '8%', // Corrigido
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