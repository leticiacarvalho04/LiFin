import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import Formulario from '../../components/formulario';
import axios from 'axios';

export default function CadastroDespesasReceitas() {
  const [selected, setSelected] = useState<'despesa' | 'receita'>('despesa');
  const initialValues = {
    Nome: '',
    Valor: 0,
    Categoria: '',
    Data: '',
    Descricao: ''
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormValues(initialValues); // Reseta os valores para os iniciais
  };

  const botaoNome = selected === 'despesa' ? 'Despesa' : 'Receita';

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
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

        {selected === 'despesa' ? (
          <SafeAreaView style={styles.form}>
            <Formulario
              values={formValues}
              onInputChange={handleInputChange}
              onReset={resetForm} // Passando a função de reset
              btn={{ nome: 'Salvar', tipoSucesso: botaoNome, rota: 'cadastro/despesas', formValues }}
            />
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.form}>
            <Formulario
              values={formValues}
              onInputChange={handleInputChange}
              onReset={resetForm} // Passando a função de reset
              btn={{ nome: 'Salvar', tipoSucesso: botaoNome, rota: 'cadastro/receitas', formValues }}
            />
          </SafeAreaView>
        )}
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
