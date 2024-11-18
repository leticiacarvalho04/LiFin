import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import Layout from "../../components/layout";
import Formulario from "../../components/formulario";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastroGastosFixos (){
    const initialValues = {
        Nome: '',
        Valor: '',
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o ID do usuário

    const handleInputChange = (field: string, value: any) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setFormValues(initialValues);
    };

    useEffect(() => {
        // Função para obter o ID do usuário do AsyncStorage
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (storedUserId) {
                    setUserId(storedUserId); // Definindo o ID do usuário
                }
            } catch (error) {
                console.error("Erro ao buscar o ID do usuário:", error);
            }
        };

        fetchUserId();

        // Listeners do teclado
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Layout>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 68 : 0}
            >
                <View style={styles.contentContainer}>
                    <View style={[styles.form, { height: isKeyboardVisible ? '60%' : '50%' }]}>
                        <View style={styles.titulo}>
                            <Text style={styles.tituloText}>Cadastro de Categoria</Text>
                        </View>
                        <Formulario
                            values={formValues}
                            fields={['Nome', 'Valor']}
                            onInputChange={handleInputChange}
                            onReset={resetForm}
                            btn={{
                                nome: 'Gasto fixo',
                                tipoSucesso: 'cadastrado',
                                rota: 'cadastro/gastoFixo',
                                formValues: { ...formValues, userId },
                                onRedirect: 'GastosFixos', // Enviando userId junto com os valores do formulário
                            }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    titulo: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: '8%',
    },
    tituloText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
    form: {
        width: '75%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        padding: 20,
    },
});
