import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Keyboard, Dimensions } from "react-native";
import Layout from "../../components/layout";
import { useState, useEffect } from "react";
import Formulario from "../../components/formulario";

export default function CadastroCategoria() {
    const initialValues = {
        Nome: '',
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <View style={styles.contentContainer}>
                    <View style={[styles.form, { height: isKeyboardVisible ? '50%' : '40%' }]}>
                        <View style={styles.titulo}>
                            <Text style={styles.tituloText}>Cadastro de Categoria</Text>
                        </View>
                        <Formulario
                            values={formValues}
                            fields={['Nome', 'Data']} // Inclua 'Data' aqui se necessário
                            onInputChange={handleInputChange}
                            onReset={resetForm} // Passando a função de reset
                            btn={{ nome: 'Categoria', tipoSucesso: 'cadastrada', rota: 'cadastro/categoria', formValues }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Layout>
    );
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
