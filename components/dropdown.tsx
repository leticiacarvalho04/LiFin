import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

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
    <View style={tw`flex justify-center border border-black rounded-xl bg-white w-[90%] p-4`}>
      <View>
        <View style={tw`flex-row justify-between`}>
          {columns.map((column) => (
            <Text key={String(column.key)} style={tw`text-center px-2 py-4 border-b border-r border-black`}>
              {column.label}
            </Text>
          ))}
        </View>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              onPress={() => handleRowClick(index)}
              style={tw`flex-row justify-between px-2 py-4 border-b border-r border-black`}
            >
              {columns.map((column) => (
                <Text key={String(column.key)} style={tw`text-center`}>
                  {String(item[column.key])}
                </Text>
              ))}
            </TouchableOpacity>
            {selectedItemId === index && (
              <View style={tw`bg-purple-600 border-t border-b border-black rounded-b-xl p-4`}>
                <View style={tw`mb-2`}>
                  <Text style={tw`font-bold text-left`}>{dropdownContent(item).idRow}</Text>
                </View>
                <View style={tw`flex-row justify-between`}>
                  <View style={tw`flex-1 mx-2`}>
                    <Text style={tw`text-left`}>{dropdownContent(item).col1}</Text>
                  </View>
                  <View style={tw`flex-1 mx-2`}>
                    <Text style={tw`text-left`}>{dropdownContent(item).col2}</Text>
                  </View>
                </View>
                {dropdownContent(item).extra && (
                  <View style={tw`mt-4`}>
                    {dropdownContent(item).extra?.map((element, idx) => (
                      <View key={idx} style={tw`mb-2`}>
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

export default TabelaGenerica;
