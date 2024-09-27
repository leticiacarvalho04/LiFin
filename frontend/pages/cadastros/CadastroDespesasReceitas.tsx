import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import Formulario from '../../components/formulario';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    setFormValues(initialValues);
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
              fields={['Nome', 'Valor', 'Categoria', 'Data', 'Descricao']} 
              onInputChange={handleInputChange}
              onReset={resetForm} // Passando a função de reset
              btn={{ nome: 'Despesa', tipoSucesso: 'cadastrada', rota: 'cadastro/despesa', formValues }}
            />
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.form}>
            <Formulario
                values={formValues}
                fields={['Nome', 'Valor', 'Categoria', 'Data', 'Descricao']} 
                onInputChange={handleInputChange}
                onReset={resetForm} // Passando a função de reset
                btn={{ nome: 'Receita', tipoSucesso: 'cadastrada', rota: 'cadastro/receita', formValues }}  
          />
          </SafeAreaView>
        )}
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