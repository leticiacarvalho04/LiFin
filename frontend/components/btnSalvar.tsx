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
  onPress?: () => boolean; // Função de validação deve retornar um booleano
  onRedirect ?: () => void;
}

export default function BtnSalvar(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    setModalVisible(true);
    const dataToSend = {
      nome: props.formValues.Nome,
      ...(props.formValues.Categoria && { categoriaId: props.formValues.Categoria }),
      ...(props.formValues.Valor && { valor: props.formValues.Valor }),
      ...(props.formValues.Data && { data: props.formValues.Data }), // Data formatada
      ...(props.formValues.Descricao && { descricao: props.formValues.Descricao }),
      ...(props.formValues.Email && { email: props.formValues.Email }),
      ...(props.formValues.Senha && { senha: props.formValues.Senha }),
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
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          // Executa a validação antes de enviar
          if (props.onPress) {
            const isValid = props.onPress(); // Executa a função de validação passada como prop
            if (isValid) {
              handleSubmit(); // Se for válido, chama a função de envio
            } else {
              console.log('A validação falhou. Não enviar o formulário.');
            }
          } else {
            handleSubmit(); // Caso não tenha onPress (validação), apenas envia
          }
        }}
      >
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
