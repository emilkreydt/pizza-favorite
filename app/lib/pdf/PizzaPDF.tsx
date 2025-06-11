import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  content: { marginTop: 10, lineHeight: 1.6 },
});

interface PizzaPDFProps {
  pizzaName: string;
  description: string;
}

export const PizzaPDF = ({ pizzaName, description }: PizzaPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{pizzaName}</Text>
      <View style={styles.content}>
        <Text>{description}</Text>
      </View>
    </Page>
  </Document>
);