import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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

const styles = StyleSheet.create({
    deleteButton: {
      backgroundColor: 'rgba(245, 86, 86, 0.76)',  // Define a cor com 76% de opacidade
      borderRadius: 8,
      padding: 16,
      width: 99,
      position: 'relative',
    },
    buttonContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    },
    deleteButtonText: {
      color: 'black',  // Cor sólida para o texto
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
    edicaoBotao: {
      backgroundColor: 'rgba(22, 217, 125, 0.57)',  // Define a cor com 57% de opacidade
      borderRadius: 8,
      padding: 16,
      width: 99,
      position: 'relative',
    },
    edicaoBotaoTexto: {
      color: 'black',  // Cor sólida para o texto
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    }
});
