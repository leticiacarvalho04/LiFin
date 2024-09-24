import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/layout';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';

export default function PainelCategorias() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
    <Layout>
      <View>
        <Text>Painel de Categorias</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CadastrarCategoria')}>
          <Text>Cadastro</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}