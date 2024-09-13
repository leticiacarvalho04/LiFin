import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

interface BotoesProps {
    tipo: 'editar' | 'excluir';
    onClickEditar?: () => void;
    onClickExcluir?: () => void;
}

export default function Botoes(props: BotoesProps) {
    return (
        <View>
            {props.tipo === 'excluir' && props.onClickExcluir && (
                <TouchableOpacity style={styles.deleteButton} onPress={props.onClickExcluir}>
                    <View style={styles.buttonContent}>
                        <Icon name="trash" size={18} color="black" />
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                    </View>
                </TouchableOpacity>
            )}
            {props.tipo === 'editar' && props.onClickEditar && (
                <TouchableOpacity style={styles.edicaoBotao} onPress={props.onClickEditar}>
                    <View style={styles.buttonContent}>
                        <Icon name="edit" size={18} color="black" />
                        <Text style={styles.edicaoBotaoTexto}>Editar</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}
