import { Document, Page, Text, StyleSheet, Image, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fffdf5',
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#b22222',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    color: '#666',
  },
  image: {
    width: 400,
    height: 260,
    objectFit: 'cover',
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 6,
  },
  section: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fffaf0',
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
});

interface PizzaPDFProps {
  pizzaName: string;
  description: string;
  imageUrl: string;
}

/**
 * Generates a styled PDF document presenting the user's ideal pizza based on quiz results.
 */

export const PizzaPDF = ({ pizzaName, description, imageUrl }: PizzaPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{pizzaName}</Text>
        <Text style={styles.subtitle}>Jouw persoonlijke pizza-profiel</Text>
      </View>

      <Image style={styles.image} src={imageUrl} />

      <View style={styles.section}>
        <Text style={styles.description}>
          {description}
        </Text>

        <Text style={styles.description}>
          Deze pizza past perfect bij jouw smaakvoorkeuren en persoonlijkheid.
          Geniet van een unieke combinatie van ingrediënten die speciaal voor jou zijn gekozen.
          Of je nu houdt van hartig, zoet, of een pittige twist. Jouw pizza zegt iets over wie je bent.
        </Text>

        <Text style={styles.description}>
          Vergeet niet: een goede pizza is meer dan alleen voedsel. Het is een ervaring, een emotie,
          een moment van puur genot. Laat je smaakpapillen genieten van deze heerlijke ontdekkingstocht.
        </Text>
      </View>

      <Text style={styles.footer}>Bedankt voor het maken van de Pizza Quiz • Buon appetito!</Text>
    </Page>
  </Document>
);
