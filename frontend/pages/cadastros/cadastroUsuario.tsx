import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Keyboard, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import BtnSalvar from "../../components/btnSalvar";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";

interface PropsFormulario {
    btn: { nome: string; tipoSucesso: string; rota: string; onRedirect?: () => void; };
}

export default function CadastroUsuario() {
    const initialValues = {
        Nome: '',
        Email: '',
        Senha: '',
    };

    const [formValues, setFormValues] = useState<{ [key: string]: string }>(initialValues);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isEmpty, setIsEmpty] = useState<{ [key: string]: boolean }>({});

    const navigation = useNavigation<any>();

    const handleInputChange = (field: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const validateFields = () => {
        const emptyFields = {
            Nome: !formValues.Nome,
            Email: !formValues.Email,
            Senha: !formValues.Senha,
        };
        setIsEmpty(emptyFields);
        return Object.values(emptyFields).every((isEmpty) => !isEmpty);
    };

    const handleRedirect = () => {
        navigation.navigate('Login'); // Navegar para a rota especificada no botão
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
                <View style={[styles.form, { height: isKeyboardVisible ? '60%' : '60%' }]}>
                    <View style={styles.titulo}>
                        <Text style={styles.tituloText}>Cadastro de Usuário</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o nome"
                            value={formValues.Nome}
                            onChangeText={(text) => handleInputChange('Nome', text)}
                        />
                        {isEmpty.Nome && <Text style={styles.errorText}>Campo obrigatório</Text>}

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o email"
                            value={formValues.Email}
                            onChangeText={(text) => handleInputChange('Email', text)}
                        />
                        {isEmpty.Email && <Text style={styles.errorText}>Campo obrigatório</Text>}

                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite a senha"
                            value={formValues.Senha}
                            onChangeText={(text) => handleInputChange('Senha', text)}
                        />
                        {isEmpty.Senha && <Text style={styles.errorText}>Campo obrigatório</Text>}
                    </View>

                    <BtnSalvar
                        nome={'Salvar'}
                        tipoSucesso={'cadastrada'}
                        onPress={() => {
                            const isValid = validateFields();
                            if (isValid) {
                                handleRedirect(); // Navega se os campos forem válidos
                            }
                            return isValid;
                        }}
                        formValues={formValues}
                        rota='cadastro/usuario' // Certifique-se de que a rota está correta aqui
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
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
        marginBottom: 15,
    },
    form: {
        width: '75%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        padding: 20,
        height: '100%',
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
        marginTop: 5,
    },
});
