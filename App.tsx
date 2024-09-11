import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CadastroDespesasReceitas from './pages/cadastros/CadastroDespesasReceitas';
import PainelDespesasReceitas from './pages/painel/PainelDespesasReceitas';
import { Navbar } from './components/navbar';
import PainelCategorias from './pages/painel/painelCategorias';
import PainelMetas from './pages/painel/painelMetas';
import PainelRelatorios from './pages/painel/painelRelatorios';
import PainelOrcamentos from './pages/painel/painelOrcamentos';

// Defina o tipo de rotas para o Stack.Navigator
export type RootStackParamList = {
  Navbar: undefined;
  CadastroDespesasReceitas: undefined;
  PainelDespesasReceitas: undefined;
  Categorias: undefined;
  Metas: undefined;
  MeusRelatorios: undefined;
  Orcamentos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Navbar">
        {/* Definindo a Navbar como a tela inicial */}
        <Stack.Screen 
          name="Navbar" 
          component={Navbar} 
          options={{ headerShown: false }}  // Oculta o cabeçalho padrão do Stack
        />
        {/* Definindo as outras rotas */}
        <Stack.Screen name="CadastroDespesasReceitas" component={CadastroDespesasReceitas} />
        <Stack.Screen name="PainelDespesasReceitas" component={PainelDespesasReceitas} />
        <Stack.Screen name="Categorias" component={PainelCategorias} />
        <Stack.Screen name="Metas" component={PainelMetas} />
        <Stack.Screen name="MeusRelatorios" component={PainelRelatorios} />
        <Stack.Screen name="Orcamentos" component={PainelOrcamentos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
