import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions, StyleSheet, StatusBar, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes';

// Importação das imagens
import homeIcon from '../assets/homeicon.png';
import pencilIcon from '../assets/pencil-dollar.png';
import folderIcon from '../assets/folder-open.png';
import businessPlanIcon from '../assets/businessplan.png';
import categoryIcon from '../assets/category.png';
import reportMoneyIcon from '../assets/report-money.png';
import reportAnalytics from '../assets/report-analytics.png';

// Defina o tipo da navegação
type NavbarProps = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const { width, height } = Dimensions.get('screen');

export function Navbar() {
    const navigation = useNavigation<NavbarProps>();
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-width * 0.75))[0];

    const opcoes = [
        { key: 'Home', label: 'Início', icon: homeIcon },
        { key: 'CadastroDespesasReceitas', label: 'Anotar despesas e receitas', icon: pencilIcon },
        { key: 'PainelDespesasReceitas', label: 'Painel de despesas e receitas', icon: folderIcon },
        { key: 'Categorias', label: 'Painel de categorias', icon: categoryIcon },
        { key: 'Orcamentos', label: 'Meus orçamentos', icon: reportAnalytics },
        { key: 'Metas', label: 'Minhas metas financeiras', icon: reportMoneyIcon },
        { key: 'GastosFixos', label: 'Painel de gastos fixos', icon: businessPlanIcon },
    ];    

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(slideAnim, {
            toValue: menuVisible ? -width * 0.75 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleUser = () => {
        navigation.navigate('PainelUsuario');
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <LinearGradient
            colors={['#a64ac9', '#6b6bbd', '#3d9be9', '#41e8d1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.navbar}
        >
            {!menuVisible && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
                        <Icon name="menu" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            )}

            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                    <Icon name="x" size={28} color="black" />
                </TouchableOpacity>

                {opcoes.map((opcao, index) => (
                    <TouchableOpacity
                        key={opcao.key}
                        style={[styles.optionButton, 
                            index === 0 && { marginTop: 20 }
                        ]}
                        onPress={() => {
                            navigation.navigate(opcao.key as keyof RootStackParamList);
                            setMenuVisible(false);
                            Animated.timing(slideAnim, {
                                toValue: -width * 0.75,
                                duration: 300,
                                useNativeDriver: true,
                            }).start();
                        }}
                    >
                        <View style={styles.linhas}>
                            <Image source={opcao.icon} style={styles.icon} />
                            <Text style={styles.optionText}>{opcao.label}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.perfil} onPress={handleUser}>
                    <Icon name="user" size={24} color="#333" />
                    <Text style={styles.optionText}>Meu Perfil</Text>
                </TouchableOpacity>

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
        width: width * 0.65,
        height: height,
        padding: 20,
        paddingTop: StatusBar.currentHeight || 20,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
    perfil: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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