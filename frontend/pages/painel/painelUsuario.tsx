import { Text, View } from "react-native";
import Layout from "../../components/layout";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PainelUsuario() {
    const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o userId

    useEffect(() => {
        // Função para recuperar o userId do AsyncStorage
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (storedUserId) {
                    setUserId(storedUserId); // Atualiza o estado com o ID do usuário
                }
            } catch (error) {
                console.error("Erro ao buscar o ID do usuário", error);
            }
        };

        fetchUserId(); // Chama a função quando o componente monta
    }, []);

    return (
        <Layout>
            <View>
                <Text>Painel de Usuário</Text>
                {userId ? (
                    <Text>ID do Usuário: {userId}</Text> // Renderiza o ID do usuário se encontrado
                ) : (
                    <Text>Carregando ID do usuário...</Text> // Exibe um texto de carregamento enquanto busca o ID
                )}
            </View>
        </Layout>
    );
}
