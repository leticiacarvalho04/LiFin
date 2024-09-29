import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DropdownProps = {
    title: string;
    date: string;
    value: string;
    valueColor?: string; // Adicionando a propriedade valueColor
    children: React.ReactNode;
    extra?: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ title, date, value, valueColor = "#2e7d32", children, extra }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <View>
                    <Text style={[styles.value, { color: valueColor }]}>R$ {value}</Text>
                </View>
            </TouchableOpacity>
            {isOpen && 
                <View style={styles.content}>
                    {children}
                    <View>{extra && <View style={styles.extraContainer}>{extra}</View>}</View>
                </View>
            }
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
    },
    header: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    headerContent: {
        flexDirection: "column",
        marginHorizontal: 13,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    date: {
        fontSize: 14,
        color: "#555",
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 10,
    },
    content: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        width: "100%",
        maxWidth: 350,
    },
    extraContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default Dropdown;
