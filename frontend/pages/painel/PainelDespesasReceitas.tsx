import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Dropdown from "../../components/dropdown";
import ListagemDespesas from "./ListagemDespesas";
import ListagemReceitas from "./listagemReceita";

export default function PainelDespesasReceitas() {
  const [selected, setSelected] = useState<'despesa' | 'receita'>('despesa');
  const initialValues = {
    nome: '',
    valor: 0,
    categoria: '',
    data: '',
    descricao: ''
  };
  const [painelValues, setPainelValues] = useState(initialValues);

  

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
          <View>
            <ListagemDespesas />
          </View>
        ) : (
          <View>
            <Text>Formulário de Receita</Text>
            <ListagemReceitas />
          </View>
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
  edicao: {
    padding: 10,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  listagem: {
    padding: 10,
  },
});