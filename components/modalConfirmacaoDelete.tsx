import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import tw from 'twrnc';

interface DeleteModalProps {
  onClose: () => void;
  nome: string;
}

const ModalConfirmacaoDelete: React.FC<DeleteModalProps> = ({ onClose, nome }) => {
  return (
    <View style={tw`bg-white border rounded-lg p-6 w-80 relative`}>
      <TouchableOpacity onPress={onClose} style={tw`absolute top-4 right-4`}>
        <Icon name="x" size={24} color="black" />
      </TouchableOpacity>

      <View style={tw`flex-row justify-between items-center mt-4 mb-2`}>
        <Icon name="alert-triangle" size={28} color="black" />
        <Text style={tw`text-lg w-40 font-semibold text-gray-900 text-center flex-1 mr-5`}>
          Deseja mesmo excluir {nome}?
        </Text>
      </View>

      <Text style={tw`text-sm text-gray-500 mt-2 text-center`}>
        Tem certeza que deseja excluir o {nome}? Essa ação não poderá ser desfeita.
      </Text>

      <View style={tw`mt-6 flex-row justify-between`}>
        <TouchableOpacity onPress={onClose} style={tw`bg-purple-600 py-2 px-4 rounded-md ml-1`}>
          <Text style={tw`text-white text-center`}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={tw`bg-black py-2 px-4 rounded-md mr-2`}>
          <Text style={tw`text-white text-center`}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModalConfirmacaoDelete;