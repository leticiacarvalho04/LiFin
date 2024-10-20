import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Layout from "../../components/layout";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ListagemCategoriasDespesas from "./listagemCategoriaDespesa";
import ListagemCategoriasReceitas from "./listagemCategoriaReceitas";
import Icon  from "react-native-vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";

export default function PainelCategoriasDespesasReceitas() {
  const [selected, setSelected] = useState<'despesa' | 'receita'>('despesa');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const initialValues = {
    nome: '',
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
        <View style={styles.titulo}>
          <Text style={styles.tituloText}>Minhas Categorias</Text>
        </View>
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
          <View style={styles.listagem}>
            <ListagemCategoriasDespesas />
          </View>
        ) : (
          <View style={styles.listagem}>
            <ListagemCategoriasReceitas />
          </View>
        )}
      </KeyboardAwareScrollView>

      {selected === 'despesa' ? (
      <TouchableOpacity onPress={() => navigation.navigate('CadastrarCategoriaDespesa')} style={styles.addButton}>
        <Icon name='plus-circle' size={40} color="#000" />
      </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('CadastrarCategoriaReceita')} style={styles.addButton}>
            <Icon name='plus-circle' size={40} color="#000" />
        </TouchableOpacity>
    )}

    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: '100%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  listagem: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
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