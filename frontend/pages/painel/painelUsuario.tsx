import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import Layout from "../../components/layout";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../api";
import { RootStackParamList } from "../../routes";
import Icon from "react-native-vector-icons/FontAwesome6"; 
import IconFeather from "react-native-vector-icons/Feather"; 
import Botoes from "../../components/botoesEdicaoExclusao";
import ModalSucesso from "../../components/modalSucesso";
import React from "react";

export default function PainelUsuario() {
    const [userId, setUserId] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [userName, setUserName] = useState<string | null>(null); 
    const [userEmail, setUserEmail] = useState<string | null>(null); 
    const [userPassword, setUserPassword] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false); 
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const buscarUsuario = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
                return;
            }
    
            const response = await axios.get(`${API_URL}/usuario`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setUserName(response.data.nome); 
            setUserEmail(response.data.email);
            setUserPassword(response.data.senha);
        } catch (error) {
            console.error("Erro ao buscar o usuário", error);
        }
    };    

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error("Erro ao buscar o ID do usuário", error);
            }
        };

        buscarUsuario();
        fetchUserId();
    }, []);

    const handleEditar = () => {
        setIsEditing(true);
    };

    const handleCancelar = () => {
        setIsEditing(false);
    };

    const handleSalvar = async () => {
        if (userName && userEmail && userPassword) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }
                const updatedUser = { nome: userName, email: userEmail, senha: userPassword };
                
                await axios.put(`${API_URL}/atualizar/usuario`, updatedUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setIsEditing(false);
                setModalVisible(true);
            } catch (error) {
                console.error("Erro ao salvar usuário:", error);
            }
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
                return;
            }
            
            await axios.delete(`${API_URL}/atualizar/usuario`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsEditing(false);
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
        }
    }

    return (
        <Layout>
            <View style={styles.mainContainer}>
                {userId ? (
                    <View style={styles.container}>
                        <Icon style={styles.icon} name="user-circle" size={90} color="#000" />
                        <View style={styles.texto}>
                            <Text style={styles.label}>Nome do usuário:</Text>
                            {isEditing ? (
                                <TextInput
                                    value={userName ?? ''}
                                    onChangeText={setUserName}
                                    style={styles.input}
                                />
                            ) : (
                                <Text style={styles.nome}>{userName}</Text>
                            )}
                        </View>
                        <View style={styles.texto}>
                            <Text style={styles.label}>Email:</Text>
                            {isEditing ? (
                                <TextInput
                                    value={userEmail ?? ''}
                                    onChangeText={setUserEmail}
                                    style={styles.input}
                                />
                            ) : (
                                <Text style={styles.textoIndividual}>{userEmail}</Text>
                            )}
                        </View>
                        <View style={styles.texto}>
                            <Text style={styles.label}>Senha:</Text>
                            {isEditing ? (
                                <View style={styles.senhaContainer}>
                                    <TextInput
                                        value={userPassword ?? ''}
                                        onChangeText={setUserPassword}
                                        secureTextEntry={!isPasswordVisible}
                                        style={styles.inputSenha}
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconeOlho}>
                                        <Text style={styles.mostrarSenha}>
                                            {isPasswordVisible ? <IconFeather name="eye-off" size={15} color="#000" /> : <IconFeather name="eye" size={15} color="#000" />}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.senhaContainer}>
                                    <Text style={styles.senhaTexto1}>{isPasswordVisible ? userPassword : '*****'}</Text>
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconeOlho}>
                                        <Text style={styles.mostrarSenha}>
                                            {isPasswordVisible ? <IconFeather name="eye-off" size={15} color="#000" /> : <IconFeather name="eye" size={15} color="#000" />}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                ) : (
                    <Text>Carregando ID do usuário...</Text>
                )}

                <View style={styles.botoesContainer}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnCancelar} onPress={handleCancelar}>
                                <Text style={styles.btnText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.edicaoBotao} onPress={handleEditar}>
                                <View style={styles.buttonContent}>
                                    <IconFeather name="edit" size={18} color="white" />
                                    <Text style={styles.edicaoBotaoTexto}>Editar</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                <View style={styles.buttonContent}>
                                    <IconFeather name="trash" size={18} color="white" />
                                    <Text style={styles.deleteButtonText}>Excluir</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {modalVisible && (
                    <ModalSucesso
                        nome={'Usuário'}
                        tipoSucesso={'atualizado'}
                        onClose={closeModal}
                        visible={modalVisible}
                    />
                )}
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between', // Garante que o espaço entre os componentes é utilizado
    },
    icon: {
        marginBottom: 20,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    inputSenha: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        flex: 1,
    },
    texto: {
        marginVertical: 10,
        width: '100%',
    },
    textoIndividual: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    senhaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    senhaTexto: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    senhaTexto1: {
        fontSize: 18,
        fontWeight: 'normal',
        flex: 1,
    },
    iconeOlho: {
        marginLeft: 10,
    },
    mostrarSenha: {
        alignItems: 'flex-end',
    },
    botoesContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // Centraliza os botões horizontalmente
        marginTop: 20,
        marginBottom: 30,
        width: '100%',
    },
    btnSalvar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginBottom: 20,
    },
    btnCancelar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    btnText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    edicaoBotao: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginBottom: 20,
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        width: '80%',
    },
    edicaoBotaoTexto: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginLeft: 5,
    },
});