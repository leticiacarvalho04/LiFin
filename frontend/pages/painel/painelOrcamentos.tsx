import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Layout from "../../components/layout";
import DonutChart from "../../components/donutChart";

export default function PainelOrcamentos() {
    return (
        <Layout>
            <View>
                <Text>Painel de Orçamentos</Text>
            </View>
            <SafeAreaView style={styles.container}>
                <DonutChart/>
            </SafeAreaView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
    },
  });
  