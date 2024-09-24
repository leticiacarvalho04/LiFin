import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from "./styles";
import { RootStackParamList } from '../../routes';

// Defina o tipo da navegação
type NavbarProps = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const { width, height } = Dimensions.get('window');

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
        { key: 'Relatorios', label: 'Meus relatórios', emoji: '📊' }
    ];    

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(slideAnim, {
            toValue: menuVisible ? -width * 0.75 : 0, // Slide para dentro ou para fora
            duration: 300,
            useNativeDriver: true,
        }).start();
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
            </Animated.View>
        </LinearGradient>
    );
}
