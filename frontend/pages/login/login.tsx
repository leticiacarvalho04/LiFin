import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { MontserratAlternates_400Regular, MontserratAlternates_600SemiBold } from "@expo-google-fonts/montserrat-alternates";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../api";

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
                const token = await AsyncStorage.getItem("token");
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
