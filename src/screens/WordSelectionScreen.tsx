import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import categories from '../constants/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/types';

type WordSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WordSelection'>;

const WordSelectionScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<WordSelectionScreenNavigationProp>();
  const { categoryName } = route.params as { categoryName: string };
  const category = categories.find(cat => cat.name === categoryName);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  const groupedWords = category.words.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, [] as any[][]);

  const renderItem = ({ item }: { item: any[] }) => (
    <View style={styles.row}>
      {item.map((word) => (
        <TouchableOpacity 
          key={word.english} 
          style={styles.card}
          onPress={() => navigation.navigate('Tool', { word })}
        >
          <Card>
            <Card.Cover source={word.image} style={styles.image} />
            <Card.Content>
              <Text style={styles.title}>{word.english}</Text>
              <Text style={styles.subtitle}>{word.spanish}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Palabras</Text>
      <FlatList
        data={groupedWords}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Regresar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    color:'black'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    margin: 8,
  },
  image: {
    height: 150,
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
    color: 'gray',
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#d32f2f', // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000', // Sombra del botón
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android, agrega un poco de elevación
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WordSelectionScreen;