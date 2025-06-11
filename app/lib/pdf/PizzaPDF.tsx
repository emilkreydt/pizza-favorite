import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
});

interface PizzaPDFProps {
  pizzaName: string;
  description: string;
  imageUrl: string;
}

export const PizzaPDF = ({ pizzaName, description, imageUrl }: PizzaPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{pizzaName}</Text>
      <Image style={styles.image} src={imageUrl} />
      <Text style={styles.description}>{description}</Text>
    </Page>
  </Document>
);