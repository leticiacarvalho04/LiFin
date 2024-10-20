import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import Formulario from '../../components/formulario';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { Categoria } from '../../types/categoria';
import axios from 'axios';
import { API_URL } from '../../api';

export default function CadastroDespesasReceitas() {
  const [selected, setSelected] = useState<'despesas' | 'receitas'>('despesas');
  const initialValues = {
    Nome: '',
    Valor: '',
    Categoria: '',
    Data: '',
    Descricao: ''
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const isFocused = useIsFocused();

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  
  const fetchCategorias = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      // Verifica o tipo selecionado e busca as categorias apropriadas
      const response = await axios.get(`${API_URL}/${selected}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoriasFirestore = response.data;
      setCategorias(categoriasFirestore);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      if ((error as any).response?.status === 401) {
        navigation.navigate('Login');
      }
    }
  };


  useEffect(() => {
    // Função para obter o ID do usuário do AsyncStorage
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Erro ao buscar o ID do usuário:", error);
      }
    };

    fetchCategorias();
    fetchUserId();
  }, [selected]); // Adiciona 'selected' como dependência

  useEffect(() => {
    if (isFocused) {
    fetchCategorias();
    }
}, [isFocused]);

  const resetForm = () => {
    setFormValues(initialValues);
  };

  const handleToggle = (type: 'despesas' | 'receitas') => {
    setSelected(type);
    resetForm();
  };

  const formatarData = (data: string): string => {
    const partes = data.split('-');
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Formato DD-MM-YYYY
  };

  const botaoNome = selected === 'despesas' ? 'Despesa' : 'Receita';

  return (
    <Layout>
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
      >
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.button, styles.leftButton, selected === 'despesas' ? styles.selectedButton : styles.unselectedButton]}
            onPress={() => handleToggle('despesas')}
          >
            <Text style={styles.text}>Despesa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rightButton, selected === 'receitas' ? styles.selectedButton : styles.unselectedButton]}
            onPress={() => handleToggle('receitas')}
          >
            <Text style={styles.text}>Receita</Text>
          </TouchableOpacity>
        </View>

        <SafeAreaView style={styles.form}>
          <Formulario
            values={formValues}
            fields={['Nome', 'Valor', 'Categoria', 'Data', 'Descricao']}
            onInputChange={handleInputChange}
            onReset={resetForm}
            categorias={categorias} // Passando categorias para o Formulario
            btn={{
              nome: botaoNome,
              tipoSucesso: 'cadastrada',
              rota: selected === 'despesas' ? 'cadastro/despesa' : 'cadastro/receita',
              formValues: {
                ...formValues,
                categoriaId: formValues.Categoria,
                data: formatarData(formValues.Data)
              },
            }}
          />
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '70%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#90EE90',
  },
  unselectedButton: {
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  form: {
    flex: 1,
    width: '75%',
    marginVertical: '5%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
});
