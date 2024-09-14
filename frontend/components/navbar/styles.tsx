import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    navbar: {
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 1,
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
    },
    menuIcon: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    sidebar: {
        backgroundColor: '#f4f4f4',
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.75, // Sidebar cobrindo 70% da largura da tela
        height: height, // Sidebar cobrindo 100% da altura da tela
        padding: 20,
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButton: {
        top: 17,
        alignSelf: 'flex-start',
        marginBottom: 20, 
    },
    optionButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
    },
    linhas: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionEmoji: {
        fontSize: 24, // Ajuste o tamanho do emoji conforme necessário
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
});

export default styles;
