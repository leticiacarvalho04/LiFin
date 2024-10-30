import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home/home'; // Adicione esta linha
import CadastroDespesasReceitas from '../pages/cadastros/CadastroDespesasReceitas';
import PainelCategorias from '../pages/painel/listagemCategoriaDespesa';
import PainelMetas from '../pages/painel/painelMetas';
import PainelOrcamentos from '../pages/painel/painelOrcamentos';
import PainelRelatorios from '../pages/painel/painelRelatorios';
import CadastroCategoria from '../pages/cadastros/cadastroDespesaCategorias';
import Login from '../pages/login/login';
import CadastroUsuario from '../pages/cadastros/cadastroUsuario';
import PainelUsuario from '../pages/painel/painelUsuario';
import PainelCategoriasDespesasReceitas from '../pages/painel/painelCategoriaDespesaReceita';
import CadastroDespesaCategoria from '../pages/cadastros/cadastroDespesaCategorias';
import CadastroReceitaCategoria from '../pages/cadastros/cadastroReceitaCategorias';
import PainelDespesasReceitas from '../pages/painel/PainelDespesasReceitas';
import CadastroGastosFixos from '../pages/cadastros/cadastroGastosFixos';
import PainelGastosFixos from '../pages/painel/painelGastosFixos';

export type RootStackParamList = {
  Login: undefined;
  PainelUsuario: undefined;
  CadastrarUsuario: undefined;
  Home: undefined;
  CadastroDespesasReceitas: undefined;
  PainelDespesasReceitas: undefined;
  Categorias: undefined;
  Metas: undefined;
  Relatorios: undefined;
  Orcamentos: undefined;
  GastosFixos: undefined;
  CadastrarGastosFixos: undefined;
  CadastrarCategoriaDespesa: undefined;
  CadastrarCategoriaReceita: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name='PainelUsuario' component={PainelUsuario} />
      <Stack.Screen name="CadastrarUsuario" component={CadastroUsuario} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CadastroDespesasReceitas" component={CadastroDespesasReceitas} />
      <Stack.Screen name="PainelDespesasReceitas" component={PainelDespesasReceitas} />
      <Stack.Screen name="Categorias" component={PainelCategoriasDespesasReceitas} />
      <Stack.Screen name="CadastrarCategoriaDespesa" component={CadastroDespesaCategoria} />
      <Stack.Screen name="CadastrarCategoriaReceita" component={CadastroReceitaCategoria} />
      <Stack.Screen name="CadastrarGastosFixos" component={CadastroGastosFixos} />
      <Stack.Screen name="Metas" component={PainelMetas} />
      <Stack.Screen name="Relatorios" component={PainelRelatorios} />
      <Stack.Screen name="Orcamentos" component={PainelOrcamentos} />
      <Stack.Screen name="GastosFixos" component={PainelGastosFixos} />
    </Stack.Navigator>
  );
}