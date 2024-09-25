import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { Categoria } from '../../types/categoria';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; // Importando o ícone
import { API_URL } from '../../api';

export default function PainelCategorias() {
  const initialValues: Categoria[] = [];
  const [categorias, setCategorias] = useState<Categoria[]>(initialValues);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorias`); // Endpoint das categorias
        console.log('Resposta da API:', response.data); // Log da resposta da API
        const categoriaData = response.data.map((categoria: Categoria): Categoria => {
          return {
            id: categoria.id,
            nome: categoria.nome,
          };
        });
        setCategorias(categoriaData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.titulo}>
          <Text style={styles.tituloText}>Minhas Categorias</Text>
        </View>
        {categorias.map((categoria: Categoria, index: number) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{categoria.nome}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('CadastrarCategoria')} style={styles.addButton}>
          <Icon name='plus-circle' size={40} color="#000" />
        </TouchableOpacity>
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
    width: '90%',
    maxWidth: 350,
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
