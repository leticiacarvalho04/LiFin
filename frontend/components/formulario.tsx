import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnSalvar from './btnSalvar';
import axios from 'axios';
import { Categoria } from '../types/categoria';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API_URL } from '../api';

interface PropsFormulario {
  fields: string[]; // Nomes dos campos
  values: { [key: string]: any };
  onInputChange?: (field: string, value: any) => void;
  onReset?: () => void;
  btn: { nome: string; tipoSucesso: string, rota: string, formValues: any };
}

export default function Formulario(props: PropsFormulario) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const inputRefs = useRef<{ [key: string]: any }>({});

  const { fields, values, onInputChange, onReset, btn } = props;

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoadingCategorias(true);
      try {
        const response = await axios.get(`${API_URL}/categorias`);
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

  const handleSubmit = (field: string) => {
    const index = fields.indexOf(field);
    if (index >= 0 && index < fields.length - 1) {
      const nextField = fields[index + 1];
      inputRefs.current[nextField]?.focus();
    } else {
      // Enviar o formulário ou fazer outra ação
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={true}
    >
      {fields.map((field, index) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={styles.label}>{field}</Text>
          {field === 'Data' ? (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text style={styles.dateText}>{values[field] || 'Selecione a data'}</Text>
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
          ) : field === 'Categoria' ? (
            <>
              {loadingCategorias ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Picker
                  selectedValue={values['Categoria']}
                  onValueChange={(itemValue) => onInputChange && onInputChange('Categoria', itemValue)}
                  style={styles.input} // Aplica o estilo do input ao Picker
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
              ref={(ref) => (inputRefs.current[field] = ref)}
              style={styles.input}
              placeholder={`Digite ${field}`}
              value={values[field]}
              onChangeText={(text) => onInputChange && onInputChange(field, text)}
              onSubmitEditing={() => handleSubmit(field)}
              returnKeyType={index < fields.length - 1 ? 'next' : 'done'}
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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    justifyContent: 'center',
  },
  inputContainer: {
    margin:'5%',
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