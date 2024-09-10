import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import SuccessModal from './components/modalSucesso';
import ModalConfirmacaoDelete from './components/modalConfirmacaoDelete';
import Botoes from './components/botoesEdicaoExclusao';

export default function App() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessModalDelete, setShowSuccessModalDelete] = useState(false);
  const [showAskDeleteModal, setShowAskDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open up App.tsx start working on your app!</Text>
      
      <Button title="Show Success Modal" onPress={() => setShowSuccessModal(true)} />
      <Button title="Show Success Modal Delete" onPress={() => setShowSuccessModalDelete(true)} />
      <Button title="Show Ask Delete Modal" onPress={() => setShowAskDeleteModal(true)} />
      <Button title="Mostrar Botão de Exclusão" onPress={() => setShowDeleteButton(true)} />
      <Button title="Mostrar Botão de Edição" onPress={() => setShowEditModal(true)} />

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} nome="parametro" tipoSucesso='cadastrado' />
      )}
      {showSuccessModalDelete && (
        <SuccessModal onClose={() => setShowSuccessModalDelete(false)} nome="parametro" tipoSucesso='excluído' />
      )}
      {/* Modal de Confirmar Delete */}
      {showAskDeleteModal && (
        <ModalConfirmacaoDelete onClose={() => setShowAskDeleteModal(false)} nome="parametro" />      
      )}
      {/* Botões de Exclusão e Edição */}
      {showDeleteButton && (
          <Botoes tipo="excluir" onClickExcluir={() => setShowDeleteButton(false)} />
      )}
      {showEditModal && (
          <Botoes tipo="editar" onClickEditar={() => setShowEditModal(false)} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    marginBottom: 16,
  },
});
