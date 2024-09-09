import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import tw from 'twrnc';

interface SucessModalProps {
  onClose: () => void;
  nome: string;
}

const ModalDeletado: React.FC<SucessModalProps> = ({ onClose, nome }) => {
  return (
    <View style={tw`bg-white border rounded-lg p-6 w-80 relative`}>
    <TouchableOpacity onPress={onClose} style={tw`absolute top-4 right-4`}>
      <Icon name="x" size={24} color="black" />
    </TouchableOpacity>

    <View style={tw`flex-row justify-between items-center mt-4 mb-2`}>
      <Icon name="check-circle" size={28} color="black" />
      <Text style={tw`text-lg w-40 font-semibold text-gray-900 text-center flex-1 mr-5`}>
        {nome} excluído com sucesso!
      </Text>
    </View>

    <Text style={tw`text-sm text-gray-500 mt-2 text-center`}>
      {nome} foi excluído com sucesso!
    </Text>

    <View style={tw`mt-6 flex-row justify-between`}>
      <TouchableOpacity onPress={onClose} style={tw`bg-black py-2 px-4 rounded-md ml-5`}>
        <Text style={tw`text-white text-center`}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

export default ModalDeletado;
