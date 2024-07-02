import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Title, Paragraph } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Category: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>VocabPlus</Title>
      <Paragraph style={styles.welcomeText}>¡Bienvenido a la mejor forma de aprender vocabulario en inglés!</Paragraph>
      <Image source={require('../../assets/vocabplus_logo.png')} style={styles.logo} />
      <Button mode="contained" onPress={() => navigation.navigate('Category')} style={styles.button}>
        Comenzar a Aprender
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
});

export default HomeScreen;