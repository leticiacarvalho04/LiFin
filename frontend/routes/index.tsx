import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home/home'; // Adicione esta linha
import CadastroDespesasReceitas from '../pages/cadastros/CadastroDespesasReceitas';
import PainelCategorias from '../pages/painel/painelCategorias';
import PainelMetas from '../pages/painel/painelMetas';
import PainelOrcamentos from '../pages/painel/painelOrcamentos';
import PainelRelatorios from '../pages/painel/painelRelatorios';
import CadastroCategoria from '../pages/cadastros/cadastroCategorias';
import PainelDespesasReceitas from '../pages/painel/PainelDespesasReceitas';
import Login from '../pages/login/login';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CadastroDespesasReceitas: undefined;
  PainelDespesasReceitas: undefined;
  Categorias: undefined;
  Metas: undefined;
  Relatorios: undefined;
  Orcamentos: undefined;
  CadastrarCategoria: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CadastroDespesasReceitas" component={CadastroDespesasReceitas} />
      <Stack.Screen name="PainelDespesasReceitas" component={PainelDespesasReceitas} />
      <Stack.Screen name="Categorias" component={PainelCategorias} />
      <Stack.Screen name="CadastrarCategoria" component={CadastroCategoria} />
      <Stack.Screen name="Metas" component={PainelMetas} />
      <Stack.Screen name="Relatorios" component={PainelRelatorios} />
      <Stack.Screen name="Orcamentos" component={PainelOrcamentos} />
    </Stack.Navigator>
  );
}