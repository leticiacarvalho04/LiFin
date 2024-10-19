import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BtnSalvar from './btnSalvar';
import axios from 'axios';
import { Categoria } from '../types/categoria';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../routes';

interface PropsFormulario {
  fields: string[];
  values: { [key: string]: any };
  onInputChange?: (field: string, value: any) => void;
  onReset?: () => void;
  errors?: { [key: string]: string };
  btn: { nome: string; tipoSucesso: string; rota: string; formValues: any; onRedirect ?: string };
}

export default function Formulario(props: PropsFormulario) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const inputRefs = useRef<{ [key: string]: any }>({});
  const [isEmpty, setIsEmpty] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o ID do usuário
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { fields, values, onInputChange, onReset, btn } = props;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Obter o token de autenticação do AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login'); // Redireciona para login se o token não estiver presente
          return;
        }

        const response = await axios.get(`${API_URL}/categorias`, {
          headers: { Authorization: `Bearer ${token}` }, // Adiciona o token no header
        });

        const categoriasFirestore = response.data;

        const storedCategoriasJSON = await AsyncStorage.getItem('categorias');
        const storedCategorias = storedCategoriasJSON ? JSON.parse(storedCategoriasJSON) : [];

        if (JSON.stringify(categoriasFirestore) !== JSON.stringify(storedCategorias) || storedCategorias.length === 0) {
          await AsyncStorage.setItem('categorias', JSON.stringify(categoriasFirestore));
          setCategorias(categoriasFirestore);
        } else {
          setCategorias(storedCategorias);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        if ((error as any).response?.status === 401) {
          navigation.navigate('Login'); // Redireciona para login se o token for inválido
        }
      }
    };

    fetchCategorias();
  }, []);

  const validateFields = () => {
    const emptyFields = fields.reduce((acc, field) => {
      acc[field] = !values[field];
      return acc;
    }, {} as { [key: string]: boolean });
    setIsEmpty(emptyFields);
    return Object.values(emptyFields).every((isEmpty) => !isEmpty);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
    return dateValue ? new Date(dateValue.split('-').reverse().join('-')) : new Date();
  };

  const handleInputChange = (field: string, text: string) => {
    onInputChange && onInputChange(field, text);
    setIsEmpty((prev) => ({
      ...prev,
      [field]: !text.trim(),
    }));
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
                  onValueChange={(itemValue) => {
                    onInputChange && onInputChange('Categoria', itemValue);
                    setIsEmpty((prev) => ({
                      ...prev,
                      Categoria: itemValue === '',
                    }));
                  }}
                  style={styles.input}
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
              onChangeText={(text) => handleInputChange(field, text)}
              returnKeyType={index < fields.length - 1 ? 'next' : 'done'}
            />
          )}
          {isEmpty[field] && <Text style={styles.errorText}>Campo obrigatório</Text>}
        </View>
      ))}

      <BtnSalvar
        nome={btn.nome}
        tipoSucesso={btn.tipoSucesso}
        onReset={onReset}
        rota={btn.rota}
        formValues={values}
        onPress={validateFields}
        onRedirect={btn.onRedirect} // Passando a prop onRedirect
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  contentContainer: {
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
