import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalSucesso from './modalSucesso';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  nome: string;
  tipoSucesso: string;
  onReset?: () => void;
  rota: string;
  formValues: any;
  onPress?: () => void;
  onRedirect?: () => void;
}

export default function BtnSalvarUsuario(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    const dataToSend = {
      nome: props.formValues.Nome,
      email: props.formValues.Email,
      senha: props.formValues.Senha,
    };

    console.log('Dados a serem enviados:', dataToSend);

    try {
      const response = await axios.post(`${API_URL}/${props.rota}`, dataToSend);
      if (response.status === 200 || response.status === 201) {
        const { uid } = response.data; // Presumindo que o UID está retornado na resposta
            const userData = {
                nome: props.formValues.Nome,
                email: props.formValues.Email,
                uid: uid,
            };
            console.log(userData,uid)

            // Verifica se o uid e userData não estão undefined
            if (uid && userData) {
                await AsyncStorage.setItem('userId', uid);
                await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Armazena como string
            } else {
                console.error('UID ou dados do usuário não estão disponíveis.');
            }
        setModalVisible(true);
        props.onReset && props.onReset();
      } else {
        console.error('Erro na resposta:', response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Erro ao enviar dados:', axiosError.response?.data || axiosError.message);
      } else {
        console.error('Erro ao enviar dados:', error);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (props.onRedirect) {
      props.onRedirect();
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          handleSubmit();
          props.onPress && props.onPress();
        }}
      >
        <Text style={styles.btnText}>{props.nome}</Text>
      </TouchableOpacity>

      <ModalSucesso
        visible={modalVisible}
        tipoSucesso={props.tipoSucesso}
        onClose={closeModal} 
        nome={'Usuário'}      
        />
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
