import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { MontserratAlternates_400Regular, MontserratAlternates_600SemiBold } from "@expo-google-fonts/montserrat-alternates";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../api";
import * as LocalAuthentication from 'expo-local-authentication'; // Importar para autenticação biométrica

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const [fontsLoaded] = useFonts({
        MontserratAlternates_400Regular,
        MontserratAlternates_600SemiBold,
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem("tokenId");
                if (token) {
                    // Se o token existir, pode-se navegar diretamente para a home ou outro fluxo desejado
                    navigation.navigate("Home");
                }
            } catch (error) {
                console.error("Erro ao verificar o token:", error);
            }
        };

        checkToken();
    }, []);

    const handleNavigateToUsuario = () => {
        navigation.navigate('CadastrarUsuario');
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                senha
            });
    
            const { uid: userId, token } = response.data;
    
            if (!userId || !token) {
                throw new Error("Usuário ou token não encontrado na resposta.");
            }

            // Armazenando o token e o ID do usuário no AsyncStorage
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("userId", userId);
    
            Alert.alert("Login bem-sucedido!");
            setEmail("");
            setSenha("");
            navigation.navigate("Home");
    
        } catch (error) {
            console.error("Erro de autenticação:", error);
            Alert.alert("Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const handleAuthentication = async () => {
        const isBiometricEnabled = await AsyncStorage.getItem("biometricEnabled") === 'true';
    
        if (!isBiometricEnabled) {
            return Alert.alert('Biometria', 'Autenticação biométrica não habilitada. Faça login normalmente.');
        }
    
        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com Biometria',
            fallbackLabel: 'Biometria não reconhecida',
        });
    
        if (auth.success) {
            try {
                // Recupera o UID do AsyncStorage
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) throw new Error("UID não encontrado.");
                console.log("UID do usuário autenticado:", userId);

                const email = await AsyncStorage.getItem('userEmail');
    
                // Realiza uma chamada à API para obter o token após a autenticação biométrica
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        uid: userId, // ou outros dados necessários para o login
                    }),
                });
                console.log("Resposta da API:", response);
    
                if (!response.ok) {
                    throw new Error("Falha ao fazer login.");
                }
    
                const data = await response.json();
                const token = data.token; // Aqui você pega o token retornado pelo backend
    
                // Armazena o token no AsyncStorage
                await AsyncStorage.setItem('token', token);
                console.log("Token do usuário autenticado:", token);
    
                // Use o UID como necessário
                console.log("UID do usuário autenticado:", userId);
                navigation.navigate("Home");
                Alert.alert("Login bem-sucedido com biometria!");
            } catch (error) {
                console.error("Erro ao autenticar com biometria:", error);
                Alert.alert("Erro ao autenticar com biometria.");
            }
        } else {
            Alert.alert('Login', 'Falha na autenticação biométrica');
        }
    };    

    useEffect(() => {
        verifyAvailableAuthentication();
    }, []);

    const verifyAvailableAuthentication = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (!compatible || !isEnrolled) {
            Alert.alert("Autenticação biométrica não disponível ou não cadastrada.");
        }
    }; 

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#a64ac9', '#6b6bbd', '#3d9be9', '#41e8d1']}
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 0.9, y: 0.8 }}
                style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.title}>LiFin</Text>
            <Text style={styles.subtitle}>Seu aplicativo definitivo de finanças pessoais!</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.biometricButton} onPress={handleAuthentication}>
                <Text style={styles.biometricText}>Login com Biometria</Text>
            </TouchableOpacity>

            <View style={styles.link}>
                <Text style={styles.texto}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={handleNavigateToUsuario}>
                    <Text style={styles.linkHighlight}>Cadastre-se!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontFamily: 'MontserratAlternates_400Regular',
        fontSize: 60,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'MontserratAlternates_400Regular',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 10,
        width: '80%',
    },
    input: {
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 15,
        width: '80%',
    },
    button: {
        backgroundColor: '#a64ac9',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 25,
        width: '40%',
    },
    biometricButton: {
        backgroundColor: '#6b6bbd',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 25,
        width: '40%',
    },
    biometricText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'MontserratAlternates_600SemiBold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'MontserratAlternates_600SemiBold',
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    texto: {
        color: '#fff',
        fontWeight: 'semibold',
    },
    linkHighlight: {
        fontSize: 13,
        marginLeft: 5,
        color: '#a64ac9',
        fontWeight: 'bold',
    },
});
