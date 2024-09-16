import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import Formulario from '../../components/formulario';

export default function CadastroDespesasReceitas() {
  const [selected, setSelected] = useState<'despesa' | 'receita'>('despesa');
  const [formValues, setFormValues] = useState({
    Nome: '',
    Valor: '',
    Data: '', // Inicializa com uma string vazia
    Descrição: '',
  });

  const handleSubmit = () => {
    if (formValues.Nome && formValues.Valor && formValues.Data && formValues.Descrição) {
      Alert.alert('Formulário enviado!', JSON.stringify(formValues));
    } else {
      Alert.alert('Erro', 'Preencha todos os campos!');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const botaoNome = selected === 'despesa' ? 'Despesa' : 'Receita';

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          {/* Botão de Despesa */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.leftButton,
              selected === 'despesa' ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => setSelected('despesa')}
          >
            <Text style={styles.text}>Despesa</Text>
          </TouchableOpacity>

          {/* Botão de Receita */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.rightButton,
              selected === 'receita' ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => setSelected('receita')}
          >
            <Text style={styles.text}>Receita</Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <SafeAreaView style={styles.form}>
          <Formulario
            values={formValues}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            btn={{ nome: botaoNome, tipoSucesso: 'cadastrada' }}
          />
        </SafeAreaView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '70%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
    marginTop: 20,
  },
});
