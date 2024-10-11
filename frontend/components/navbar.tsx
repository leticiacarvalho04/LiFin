import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { Link, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../routes';
import Login from '../pages/login/login';

// Defina o tipo da navegação
type NavbarProps = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const { width, height } = Dimensions.get('screen'); // Obtém a altura total da tela, incluindo a área da barra de status

export function Navbar() {
    const navigation = useNavigation<NavbarProps>();
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-width * 0.75))[0]; // Posição inicial fora da tela

    const opcoes = [
        { key: 'Home', label: 'Início', emoji: '🏠' },
        { key: 'CadastroDespesasReceitas', label: 'Anotar despesas e receitas', emoji: '📝' },
        { key: 'PainelDespesasReceitas', label: 'Painel de despesas e receitas', emoji: '🗃' },
        { key: 'Categorias', label: 'Painel de categorias', emoji: '🏷️' },
        { key: 'Orcamentos', label: 'Meus orçamentos', emoji: '💸' },
        { key: 'Metas', label: 'Minhas metas financeiras', emoji: '🎯' },
        { key: 'Relatorios', label: 'Meus relatórios', emoji: '📊' },
    ];    

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(slideAnim, {
            toValue: menuVisible ? -width * 0.75 : 0, // Slide para dentro ou para fora
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <LinearGradient
            colors={['#a64ac9', '#6b6bbd', '#3d9be9', '#41e8d1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}  // Gradiente na diagonal
            style={styles.navbar}
        >
            {/* Menu Hamburguer estará na sidebar */}
            {!menuVisible && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
                        <Icon name="menu" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Sidebar com opções */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                {/* Ícone para fechar o menu */}
                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                    <Icon name="x" size={28} color="black" />
                </TouchableOpacity>

                {/* As opções do menu */}
                {opcoes.map((opcao, index) => (
                    <TouchableOpacity
                        key={opcao.key}
                        style={[
                            styles.optionButton, 
                            index === 0 && { marginTop: 20 } // Aplica margem apenas ao primeiro item
                        ]}
                        onPress={() => {
                            navigation.navigate(opcao.key as keyof RootStackParamList);
                            setMenuVisible(false); // Fecha o menu ao navegar
                            Animated.timing(slideAnim, {
                                toValue: -width * 0.75, // Recolher menu após navegação
                                duration: 300,
                                useNativeDriver: true,
                            }).start();
                        }}
                    >
                        <View style={styles.linhas}>
                            <Text style={styles.optionEmoji}>{opcao.emoji}</Text>
                            <Text style={styles.optionText}>{opcao.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.sair} onPress={handleLogout}>
                    <Icon name="log-out" size={24} color="#333" />
                    <Text style={styles.optionText}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    navbar: {
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 1,
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 25,
    },
    menuIcon: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    sidebar: {
        backgroundColor: '#f4f4f4',
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.65, // Sidebar cobrindo 65% da largura da tela
        height: height, // Sidebar cobrindo 100% da altura da tela
        padding: 20,
        paddingTop: StatusBar.currentHeight || 20, // Espaço para a barra de status
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButton: {
        top: 20,
        alignSelf: 'flex-start',
        marginBottom: 20, 
        marginTop: 10, 
    },
    optionButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
    },
    linhas: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    optionEmoji: {
        fontSize: 24, // Ajuste o tamanho do emoji conforme necessário
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
    sair: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
});
