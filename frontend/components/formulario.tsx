import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importando o Picker para seleção de categorias
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnSalvar from './btnSalvar';
import ModalSucesso from './modalSucesso'; // Certifique-se que o modalSucesso está correto
import axios from 'axios';
import { Categoria } from '../types/categoria';

interface PropsFormulario {
  values: { [key: string]: any };
  onInputChange?: (field: string, value: any) => void;
  onSubmit?: () => void;
  onReset?: () => void;
  btn: { nome: string; tipoSucesso: string, rota: string, formValues: any}; // Adiciona rota e formValues
}

export default function Formulario(props: PropsFormulario) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  const { values, onInputChange, onSubmit, onReset, btn } = props;

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoadingCategorias(true);
      try {
        const response = await axios.get('http://192.168.0.5:3000/listar/categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onInputChange && onInputChange('Data', formattedDate);
    }
    setShowDatePicker(false);
  };

  const getDateValue = (): Date => {
    const dateValue = values['Data'];
    return dateValue ? new Date(dateValue.split('/').reverse().join('-')) : new Date();
  };

  return (
    <View style={styles.container}>
      {Object.keys(values).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}</Text>
          {key === 'Data' ? (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text style={styles.dateText}>{values[key] || 'Selecione a data'}</Text>
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
          ) : key === 'Categoria' ? (
            <>
              {loadingCategorias ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Picker
                  selectedValue={values['Categoria']}
                  onValueChange={(itemValue) => onInputChange && onInputChange('Categoria', itemValue)}
                >
                  <Picker.Item label="Selecione uma categoria" value="" />
                  {categorias.map((categoria) => (
                    <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                  ))}
                </Picker>
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

      <BtnSalvar 
        nome={btn.nome} 
        tipoSucesso={btn.tipoSucesso} 
        onReset={onReset} 
        rota={btn.rota}
        formValues={btn.formValues}
      />
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
});
