import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import categories from '../constants/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/types';

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categorías</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WordSelection', { categoryName: item.name })}
          >
            <Card>
              <Card.Cover source={item.image} style={styles.image} />
              <Card.Content>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.nameSpanish}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  card: {
    flex: 1,
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
});

export default CategoryScreen;