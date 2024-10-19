import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import Formulario from '../../components/formulario';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroDespesasReceitas() {
  const [selected, setSelected] = useState<'despesa' | 'receita'>('despesa');
  const initialValues = {
    Nome: '',
    Valor: '',
    Categoria: '',
    Data: '',
    Descricao: ''
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o ID do usuário

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  useEffect(() => {
    // Função para obter o ID do usuário do AsyncStorage
    const fetchUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId); // Definindo o ID do usuário
            }
        } catch (error) {
            console.error("Erro ao buscar o ID do usuário:", error);
        }
    };

    fetchUserId();
}, []);

  const resetForm = () => {
    setFormValues(initialValues);
  };

  const handleToggle = (type: 'despesa' | 'receita') => {
    setSelected(type);
    resetForm(); // Limpa o formulário ao trocar de tipo
  };

  const formatarData = (data: string): string => {
    const partes = data.split('-');
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Formato DD-MM-YYYY
  };

  const botaoNome = selected === 'despesa' ? 'Despesa' : 'Receita';

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
            style={[
              styles.button,
              styles.leftButton,
              selected === 'despesa' ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => handleToggle('despesa')} // Usando a função handleToggle
          >
            <Text style={styles.text}>Despesa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.rightButton,
              selected === 'receita' ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => handleToggle('receita')} // Usando a função handleToggle
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
            btn={{
              nome: botaoNome,
              tipoSucesso: 'cadastrada',
              rota: selected === 'despesa' ? 'cadastro/despesa' : 'cadastro/receita',
              formValues: {
                ...formValues,
                categoriaId: formValues.Categoria, // Use o ID da categoria
                data: formatarData(formValues.Data) // Formatando a data
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
