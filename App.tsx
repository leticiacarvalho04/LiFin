import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import tw from 'twrnc';
import SuccessModal from './components/modalCadastroSucesso';
import DeleteModal from './components/modalConfirmacaoDelete';
import ModalDeletado from './components/modalDelete';
import ModalConfirmacaoDelete from './components/modalConfirmacaoDelete';

export default function App() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAskDeleteModal, setShowAskDeleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Text style={tw`mb-4`}>Open up App.tsx to start working on your app!</Text>
      
      {/* Botão para exibir o modal de sucesso */}
      <Button title="Show Success Modal" onPress={() => setShowSuccessModal(true)} />

      {/* Botão para exibir o modal de deletar */}
      <Button title="Show Delete Modal" onPress={() => setShowDeleteModal(true)} />

      <Button title="Show Ask Delete Modal" onPress={() => setShowAskDeleteModal(true)} />

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} nome="parametro" />
      )}

      {/* Modal de Delete */}
      {showAskDeleteModal && (
        <ModalConfirmacaoDelete onClose={() => setShowAskDeleteModal(false)} nome="parametro" />      
      )}

      {showDeleteModal && (
        <ModalDeletado onClose={() => setShowDeleteModal(false)} nome="parametro" />      
      )}
    </View>
  );
}
