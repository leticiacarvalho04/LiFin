import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

interface TableProps<T> {
  data: T[];
  columns: Array<{
    label: string;
    key: keyof T;
  }>;
  detailExtractor: (item: T) => JSX.Element;
  dropdownContent: (item: T) => { idRow: JSX.Element; col1: JSX.Element; col2: JSX.Element; extra?: JSX.Element[] };
}

const TabelaGenerica = <T,>({ data, columns, dropdownContent }: TableProps<T>): JSX.Element => {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleRowClick = (itemId: number) => {
    setSelectedItemId((prevId) => (prevId === itemId ? null : itemId));
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          {columns.map((column) => (
            <Text key={String(column.key)} style={styles.headerCell}>
              {column.label}
            </Text>
          ))}
        </View>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              onPress={() => handleRowClick(index)}
              style={styles.row}
            >
              {columns.map((column) => (
                <Text key={String(column.key)} style={styles.cell}>
                  {String(item[column.key])}
                </Text>
              ))}
            </TouchableOpacity>
            {selectedItemId === index && (
              <View style={styles.dropdown}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownText}>{dropdownContent(item).idRow}</Text>
                </View>
                <View style={styles.dropdownContent}>
                  <View style={styles.dropdownCol}>
                    <Text style={styles.dropdownText}>{dropdownContent(item).col1}</Text>
                  </View>
                  <View style={styles.dropdownCol}>
                    <Text style={styles.dropdownText}>{dropdownContent(item).col2}</Text>
                  </View>
                </View>
                {dropdownContent(item).extra && (
                  <View style={styles.extraContent}>
                    {dropdownContent(item).extra?.map((element, idx) => (
                      <View key={idx} style={styles.extraElement}>
                        {element}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    width: '90%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCell: {
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRightWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRightWidth: 1,
  },
  cell: {
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: '#6A5ACD', // Cor para o fundo do dropdown
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 16,
  },
  dropdownHeader: {
    marginBottom: 8,
  },
  dropdownText: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownCol: {
    flex: 1,
    marginHorizontal: 8,
  },
  extraContent: {
    marginTop: 16,
  },
  extraElement: {
    marginBottom: 8,
  },
});

export default TabelaGenerica;
