import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnSalvar from './btnSalvar';

interface Props {
  values: { [key: string]: any }; // Valores dos inputs do formulário
  onInputChange?: (field: string, value: any) => void; // Função para atualizar o estado dos inputs
  onSubmit?: () => void; // Função de envio do formulário
  btn: { nome: string; tipoSucesso: string };
}

export default function Formulario(props: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { values, onInputChange, onSubmit, btn } = props;

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onInputChange && onInputChange('Data', formattedDate);
    }
    // Sempre oculta o picker após a seleção
    setShowDatePicker(false);
  };

  const getDateValue = (): Date => {
    const dateValue = values['Data'];
    return dateValue ? new Date(dateValue.split('/').reverse().join('-')) : new Date();
  };

  return (
    <View style={styles.container}>
      {/* Renderizar inputs dinamicamente com base nos valores */}
      {Object.keys(values).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}</Text>
          {key === 'Data' ? (
            <>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={styles.dateText}>
                  {values[key] || 'Selecione a data'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={getDateValue()}
                  onChange={handleDateChange}
                  display="default"
                />
              )}
            </>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={`Digite ${key}`}
              value={values[key]}
              onChangeText={(text) => onInputChange && onInputChange(key, text)}
            />
          )}
        </View>
      ))}

      {/* Botão de Enviar */}
      <BtnSalvar nome={btn.nome} tipoSucesso={btn.tipoSucesso} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
});
