import React, { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Meta } from "../types/metas";
import ProgressBar from "./progressBar";
import Icon from "react-native-vector-icons/Feather";

type DropdownProps = {
  meta: Meta;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof Meta, value: string) => void;
  onDateChange: (date: string) => void;
};

const DropdownMetas: React.FC<DropdownProps> = ({
  meta,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onInputChange,
  onDateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [date, setDate] = useState(
    meta.data ? new Date(meta.data) : new Date()
  );
  const [nome, setNome] = useState(meta.nome);
  const [valorAtual, setValorAtual] = useState(meta.valorAtual.toString());
  const [valorTotal, setValorTotal] = useState(meta.valorTotal.toString());

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false); // Fechar o DateTimePicker
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato ISO (YYYY-MM-DD)
      setDate(selectedDate); // Atualiza a data local
      onDateChange(formattedDate); // Chama o onDateChange para passar a data para o componente pai
    }
  };

  const handleInputChange = (field: keyof Meta, value: string) => {
    if (field === "nome") setNome(value);
    else if (field === "valorAtual") setValorAtual(value);
    else if (field === "valorTotal") setValorTotal(value);

    onInputChange(field, value); // Passa a alteração para o componente pai
  };

  const calculatePercentage = (valorAtual: number, valorTotal: number): number => {
    if (valorTotal <= 0) return 0; // Evita divisão por zero
    return Math.min(100, (valorAtual / valorTotal) * 100); // Limita a porcentagem a 100%
  };

  const formatarPorcentagem = (valor: number): string => {
    return `${valor.toFixed(2).replace(".", ",")}%`;
  };

  const formatarData = (dataString: string): string => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.header}>
        <View>
          {!isEditing && (
            <>
              <View style={styles.nomeEdata}>
                <Text style={styles.title}>{meta.nome}</Text>
                <Text style={styles.date}>{meta.data}</Text>
              </View>
              <View>
                <Text style={styles.value}>
                  Valor atual R$ {meta.valorAtual} de R$ {meta.valorTotal}
                </Text>
              </View>
              <ProgressBar progress={meta.porcentagem} />
              <View>
                <Text style={styles.porcentagem}>
                  {formatarPorcentagem(meta.porcentagem)}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.content}>
          {!isEditing ? (
            <View style={styles.botoes}>
              <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                <Icon name="edit" size={24} color="#000" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Icon name="trash" size={24} color="#000" />
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editContainer}>
              <Text style={styles.cardTitle}>Nome</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={(text) => handleInputChange("nome", text)}
              />
              <Text style={styles.cardTitle}>Valor total</Text>
              <TextInput
                style={styles.input}
                value={valorTotal}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("valorTotal", text)}
              />
              <Text style={styles.cardTitle}>Valor atual</Text>
              <TextInput
                style={styles.input}
                value={valorAtual}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("valorAtual", text)}
              />
              <Text style={styles.cardTitle}>Data</Text>
              <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {date
                    ? formatarData(date.toISOString().split("T")[0])
                    : "Selecionar data"}
                </Text>
              </TouchableOpacity>
              {isDatePickerVisible && (
                <DateTimePicker
                  value={date} // Usa o estado 'date' para garantir que o valor correto seja mostrado
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <View style={styles.editButtons}>
                <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "90%",
  },
  header: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "regular",
    color: "#333",
  },
  nomeEdata: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  porcentagem: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    marginBottom: 10,
    fontSize: 14,
    color: "#888",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  content: {
    marginTop: 10,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "75%",
    marginRight: 0,
    gap: 30,
    marginBottom: 10,
  },
  editContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  editButtonText: {
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 3,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
  },
  deleteButtonText: {
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  saveButtonText: {
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    borderRadius: 5,
    padding: 8,
  },
  cancelButtonText: {
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default DropdownMetas;
