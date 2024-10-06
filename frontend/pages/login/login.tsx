import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { MontserratAlternates_400Regular, MontserratAlternates_600SemiBold } from "@expo-google-fonts/montserrat-alternates";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false); // Para exibir o spinner de loading
    const navigation = useNavigation<any>(); // Para navegação

    const [fontsLoaded] = useFonts({
        MontserratAlternates_400Regular,
        MontserratAlternates_600SemiBold,
    });

    // Função para tratar o login
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Fazer a requisição para a rota
      const response = await axios.get(`${API_URL}/usuarios`);

      // Procurar o usuário com o email e senha fornecidos
      const user = response.data.find((usuario: any) => usuario.email === email && usuario.senha === senha);

      if (user) {
        // Se o usuário for encontrado, redirecionar para a página Home
        Alert.alert("Login bem-sucedido!");
        navigation.navigate("Home"); // Redireciona para Home
      } else {
        // Se o usuário não for encontrado
        Alert.alert("Email ou senha incorretos!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Ocorreu um erro ao tentar fazer login.");
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
             start={{ x: 0.1, y: 0.2 }} // Ajuste fino no início do gradiente
             end={{ x: 0.9, y: 0.8 }}   // Ajuste fino no fim do gradiente
             style={StyleSheet.absoluteFillObject} // Preenche todo o container
            />

        <Text style={styles.title}>LiFin</Text>
        <Text style={styles.subtitle}>Seu aplicativo definitivo de finanças pessoais!
        </Text>
        
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

        <Text style={styles.link}>
            <Text>Não tem uma conta? </Text>
            <Text style={styles.linkHighlight}>Cadastre-se!</Text>
        </Text>
        </View>
    )
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 25,
        width: '40%',
    },
    buttonText: {
        color: '#a64ac9',
        fontSize: 15,
        fontFamily: 'MontserratAlternates_600SemiBold',
    },
    link: {
        justifyContent: 'space-between',
        color: '#fff',
        textAlign: 'center',
        width: '80%',
    },
    linkHighlight: {
        fontSize: 13,
        marginLeft: 15,
        color: '#a64ac9',
        fontWeight: 'bold',
    },
});
