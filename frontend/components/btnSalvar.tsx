import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import ModalSucesso from './modalSucesso';
import axios from 'axios';
import { API_URL } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Categoria } from '../types/categoria';

interface Props {
  nome: string;
  tipoSucesso: string;
  onReset?: () => void;
  rota: string;
  formValues: any;
  onPress?: () => boolean; // Função de validação deve retornar um booleano
  onRedirect ?: string;
  categoria?: Categoria[];
}

export default function BtnSalvar(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o ID do usuário

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        alert('Deslogado!'); // Redireciona para login se o token não estiver presente
        return;
    }
  
    setModalVisible(true);
  
    // Prepare os dados a serem enviados
    const dataToSend = {
        nome: props.formValues.Nome,
        categoriaId: props.formValues.Categoria, // Certifique-se de que este é o ID da categoria
        valor: props.formValues.Valor,
        data: props.formValues.Data, // A data deve estar no formato esperado no backend
        descricao: props.formValues.Descricao,
        userId: userId, // Inclui o userId nos dados enviados
    };
  
    console.log('Dados enviados:', dataToSend);
  
    try {
        const response = await axios.post(`${API_URL}/${props.rota}`, dataToSend, {
            headers: { Authorization: `Bearer ${token}` }, // Adiciona o token no header
        });
        console.log(response.data);
  
        if (response.status === 200 || response.status === 201) {
            props.onReset && props.onReset();
            props.onRedirect && props.onRedirect; // Chama a função de redirecionamento
        } else {
            console.error('Erro na resposta:', response);
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
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
          onRedirect={props.onRedirect}
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
