import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Keyboard, TextInput, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import BtnSalvarUsuario from "../../components/btnSalvarUsuario";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CadastroUsuario() {
    const initialValues = {
        Nome: '',
        Email: '',
        Senha: '',
    };

    const [formValues, setFormValues] = useState<{ [key: string]: string }>(initialValues);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isEmpty, setIsEmpty] = useState<{ [key: string]: boolean }>({});
    const [userUID, setUserUID] = useState<string | null>(null); // Adiciona o UID ao estado

    const navigation = useNavigation<any>();

    const handleInputChange = (field: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));

        if (field === 'Senha') {
            verifyPassword(value);
        }
    };

    const validateFields = () => {
        const emptyFields = {
            Nome: !formValues.Nome,
            Email: !verifyEmail(formValues.Email), 
            Senha: !verifyPassword(formValues.Senha),
        };
        setIsEmpty(emptyFields);
        return Object.values(emptyFields).every((isEmpty) => !isEmpty);
    };

    const verifyEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setIsEmpty((prevValues) => ({
                ...prevValues,
                Email: false,
            }));
            return true;
        } else {
            setIsEmpty((prevValues) => ({
                ...prevValues,
                Email: true,
            }));
            return false;
        }
    };

    const verifyPassword = (senha: string) => {
        if (senha.length < 6) {
            setIsEmpty((prevValues) => ({
                ...prevValues,
                Senha: true,
            }));
            return false;
        } else {
            setIsEmpty((prevValues) => ({
                ...prevValues,
                Senha: false,
            }));
            return true;
        }
    };

    const handleRedirect = async () => {
        const isValid = validateFields();
        if (isValid) {
            const generatedUID = "12345"; // Substitua isso pelo UID real gerado após o cadastro
            setUserUID(generatedUID);
    
            // Salva os dados de login no AsyncStorage
            await AsyncStorage.setItem("userId", generatedUID);
            await AsyncStorage.setItem("userEmail", formValues.Email); // Armazena o email
            await AsyncStorage.setItem("userPassword", formValues.Senha); // Armazena a senha
    
            Alert.alert(
                "Habilitar Biometria",
                "Você deseja habilitar a autenticação biométrica?",
                [
                    { text: "Não", style: "cancel" },
                    { 
                        text: "Sim", 
                        onPress: async () => {
                            await registerBiometric(generatedUID);
                            navigation.navigate('Login');
                        }
                    }
                ]
            );
        }
    };       

    const registerBiometric = async (uid: string) => {
        await AsyncStorage.setItem("biometricEnabled", 'true');
        await AsyncStorage.setItem("userUID", uid); // Salva o UID do usuário
        Alert.alert("Biometria habilitada com sucesso!");
    };

    useEffect(() => {
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
                    <Icon name="corner-up-left" size={25} />
                </TouchableOpacity>

                <View style={styles.form}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.titulo}>
                            <Text style={styles.tituloText}>Cadastro de Usuário</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nome <Text style={styles.asterisco}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o nome"
                                value={formValues.Nome}
                                onChangeText={(text) => handleInputChange('Nome', text)}
                            />
                            {isEmpty.Nome && <Text style={styles.errorText}>Campo obrigatório</Text>}

                            <Text style={styles.label}>Email <Text style={styles.asterisco}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o email"
                                value={formValues.Email}
                                onChangeText={(text) => handleInputChange('Email', text)}
                            />
                            {isEmpty.Email && <Text style={styles.errorText}>Por favor insira um email válido</Text>}

                            <Text style={styles.label}>Senha <Text style={styles.asterisco}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a senha"
                                value={formValues.Senha}
                                onChangeText={(text) => handleInputChange('Senha', text)}
                                secureTextEntry
                            />
                            {isEmpty.Senha && <Text style={styles.errorText}>A senha deve ter pelo menos 6 caracteres</Text>}
                        </View>

                        <BtnSalvarUsuario
                            nome={'Salvar'}
                            tipoSucesso={'cadastrada'}
                            onPress={handleRedirect}
                            formValues={formValues}
                            rota='cadastro/usuario'
                        />
                    </ScrollView>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voltar: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
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
    asterisco: {
        color: 'red',
    },
    form: {
        width: '75%',
        height: 'auto', 
        maxHeight: '80%', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        padding: 20,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
});