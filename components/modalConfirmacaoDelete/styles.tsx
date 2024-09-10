import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      padding: 16,
      width: 320,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    messageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
    },
    confirmationMessage: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      flex: 1,
      marginRight: 16,
    },
    additionalMessage: {
      fontSize: 14,
      color: '#888',
      marginTop: 8,
      textAlign: 'center',
    },
    buttonContainer: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    deleteButton: {
      backgroundColor: '#A164E3',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    deleteButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: '#000',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    cancelButtonText: {
      color: 'white',
      textAlign: 'center',
    },
  });

  export default styles;