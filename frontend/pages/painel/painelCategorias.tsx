import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { Categoria } from '../../types/categoria';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; // Importando o ícone
import { API_URL } from '../../api';
import Swal from 'sweetalert2';
import ModalSucesso from '../../components/modalSucesso';
import ModalConfirmacaoDelete from '../../components/modalConfirmacaoDelete';

export default function PainelCategorias() {
  const initialValues: Categoria[] = [];
  const [categorias, setCategorias] = useState<Categoria[]>(initialValues);
  const [isEditing, setIsEditing] = useState<number | null>(null); // Index da categoria sendo editada
  const [editedCategoria, setEditedCategoria] = useState<Categoria | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal de sucesso
  const [modalMessage, setModalMessage] = useState({ nome: '', tipoSucesso: '' });
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Modal de confirmação de exclusão
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorias`);
        const categoriaData = response.data.map((categoria: Categoria): Categoria => ({
          id: categoria.id,
          nome: categoria.nome,
        }));
        setCategorias(categoriaData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleEdit = (index: number) => {
    setIsEditing(index); // Define a edição
    setEditedCategoria({ ...categorias[index] }); // Clona a categoria para edição
  };

  const handleInputChange = (field: keyof Categoria, value: string) => {
    if (editedCategoria) {
      setEditedCategoria({
        ...editedCategoria,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (editedCategoria && isEditing !== null) {
      try {
        await axios.put(`${API_URL}/atualizar/categoria/${editedCategoria.id}`, editedCategoria);
        const updatedCategorias = [...categorias];
        updatedCategorias[isEditing] = editedCategoria;
        setCategorias(updatedCategorias);
        setIsEditing(null);
        setEditedCategoria(null);

        // Exibir modal de sucesso após edição
        setModalMessage({ nome: 'Categoria', tipoSucesso: 'editada' });
        setModalVisible(true);
      } catch (error) {
        console.error("Erro ao editar categoria:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedCategoria(null);
  };

  const handleDelete = (categoria: Categoria) => {
    setCategoriaToDelete(categoria); 
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
      if (categoriaToDelete) {
          try {
              await axios.delete(`${API_URL}/excluir/categoria/${categoriaToDelete.id}`);
              setCategorias(prev => prev.filter(categoria => categoria.id !== categoriaToDelete.id));
              setModalMessage({ nome: 'Categoria', tipoSucesso: 'excluída' });
              setModalVisible(true); 
          } catch (error) {
              console.error("Erro ao deletar despesa:", error);
          } finally {
              setConfirmDeleteVisible(false); 
              setCategoriaToDelete(null);
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
          <Text style={styles.tituloText}>Minhas Categorias</Text>
        </View>
        {categorias.map((categoria: Categoria, index: number) => (
          <View key={index} style={styles.card}>
            {isEditing === index ? (
              <View>
                <TextInput
                  style={styles.input}
                  value={editedCategoria?.nome}
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
        <TouchableOpacity onPress={() => navigation.navigate('CadastrarCategoria')} style={styles.addButton}>
          <Icon name='plus-circle' size={40} color="#000" />
        </TouchableOpacity>

        <ModalSucesso 
          nome="Despesa"
          visible={modalVisible} 
          tipoSucesso={`A ${modalMessage.nome} foi ${modalMessage.tipoSucesso} com sucesso!`} 
          onClose={handleCloseModal} 
        />
        <ModalConfirmacaoDelete 
          visible={confirmDeleteVisible} 
          onClose={handleCloseConfirmModal} 
          onConfirm={confirmDelete} 
          nome={categoriaToDelete ? categoriaToDelete.nome : ''} 
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
