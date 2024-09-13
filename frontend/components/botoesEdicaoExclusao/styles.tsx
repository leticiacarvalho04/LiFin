import { StyleSheet } from 'react-native';

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

export default styles;
