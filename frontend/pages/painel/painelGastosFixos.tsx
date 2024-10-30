import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import { NavigationProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import { API_URL } from '../../api';
import ModalSucesso from '../../components/modalSucesso';
import ModalConfirmacaoDelete from '../../components/modalConfirmacaoDelete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GastosFixos } from '../../types/gastosFixos';

export default function PainelGastosFixos() {
  const initialValues: GastosFixos[] = [];
  const [gastosFixos, setGastosFixos] = useState<GastosFixos[]>(initialValues);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedGastos, setEditedGastos] = useState<GastosFixos | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ nome: '', tipoSucesso: '' });
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState<GastosFixos | null>(null); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused(); // Hook para verificar se a tela está em foco

  // Função para buscar as categorias
  const fetchGastos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${API_URL}/gastos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const gastosFirestore = response.data;
      const storedGastosJSON = await AsyncStorage.getItem('gastos');
      const storedGastos = storedGastosJSON ? JSON.parse(storedGastosJSON) : [];

      if (JSON.stringify(gastosFirestore) !== JSON.stringify(storedGastos) || storedGastos.length === 0) {
        await AsyncStorage.setItem('gastos', JSON.stringify(gastosFirestore));
        setGastosFixos(gastosFirestore);
      } else {
        setGastosFixos(storedGastos);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      if ((error as any).response?.status === 401) {
        navigation.navigate('Login');
      }
    }
  };

  // UseEffect para buscar categorias toda vez que a tela estiver em foco
  useEffect(() => {
    if (isFocused) {
      fetchGastos();
    }
  }, [isFocused]);

  const handleEdit = (index: number) => {
    setIsEditing(index);
    setEditedGastos({ ...gastosFixos[index] });
  };

  const handleInputChange = (field: keyof GastosFixos, value: string) => {
    if (editedGastos) {
      setEditedGastos({
        ...editedGastos,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (editedGastos && isEditing !== null) {
      try {
        const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.navigate('Login');
            return;
        }
        await axios.put(`${API_URL}/atualizar/gastoFixo/${editedGastos.id}`, editedGastos, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedGasto = [...gastosFixos];
        updatedGasto[isEditing] = editedGastos;
        setGastosFixos(updatedGasto);
        setIsEditing(null);
        setEditedGastos(null);

        setModalMessage({ nome: 'Gasto', tipoSucesso: 'editadao' });
        setModalVisible(true);
      } catch (error) {
        console.error("Erro ao editar gasto:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedGastos(null);
  };

  const handleDelete = (gasto: GastosFixos) => {
    setGastoToDelete(gasto); 
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
      if (gastoToDelete) {
          try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                navigation.navigate('Login');
                return;
              }
              await axios.delete(`${API_URL}/excluir/gastoFixo/${gastoToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setGastosFixos(prev => prev.filter(gasto => gasto.id !== gastoToDelete.id));
              setModalMessage({ nome: 'Gasto fixo', tipoSucesso: 'excluído' });
              setModalVisible(true); 
          } catch (error) {
              console.error("Erro ao deletar despesa:", error);
          } finally {
              setConfirmDeleteVisible(false); 
              setGastoToDelete(null);
          }
      }
  };

  const handleCloseModal = () => {
      setModalVisible(false); 
  };

  const handleCloseConfirmModal = () => {
      setConfirmDeleteVisible(false);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.titulo}>
          <Text style={styles.tituloText}>Meus gastos fixos</Text>
        </View>
        {gastosFixos.map((categoria: GastosFixos, index: number) => (
          <View key={index} style={styles.card}>
            {isEditing === index ? (
              <View>
                <TextInput
                  style={styles.input}
                  value={editedGastos?.nome}
                  onChangeText={(text) => handleInputChange('nome', text)}
                />
                <View style={styles.botoes}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.title}>{categoria.nome}</Text>
                </View>
                <View style={styles.botoes}>
                  <View style={styles.btn}>
                    <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editButton}>
                      <Icon name='edit' size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(categoria)} style={styles.deleteButton}>
                      <Icon name='trash' size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CadastrarGastosFixos')} style={styles.addButton}>
          <Icon name='plus-circle' size={40} color="#000" />
        </TouchableOpacity>

        <ModalSucesso 
          nome="Gasto"
          visible={modalVisible} 
          tipoSucesso={`O ${modalMessage.nome} foi ${modalMessage.tipoSucesso} com sucesso!`} 
          onClose={handleCloseModal} 
        />
        <ModalConfirmacaoDelete 
          visible={confirmDeleteVisible} 
          onClose={handleCloseConfirmModal} 
          onConfirm={confirmDelete} 
          nome={gastoToDelete ? gastoToDelete.nome : ''} 
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 20,
    alignItems: 'center',
    width: '65%',
    marginRight: 0,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  editButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  deleteButton: {
    justifyContent: 'flex-end',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
  },
  saveButtonText: {
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    borderRadius: 10,
    padding: 5,
  },
  cancelButtonText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    marginVertical: 5,
    padding: 5,
    width: '100%',
  },
  titulo: {
    margin: '7%',
    marginBottom: '10%',
  },
  tituloText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: 'center',
  },
  card: {
    display: 'flex',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});