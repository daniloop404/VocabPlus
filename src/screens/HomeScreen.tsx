import * as React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';

type RootStackParamList = {
  Home: undefined;
  Category: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [fontsLoaded] = Font.useFonts({
    Cafe: require('../../assets/fonts/Dino.ttf'), // Asegúrate de que la ruta sea correcta
  });

  if (!fontsLoaded) {
    return null; // Mostrar una pantalla de carga mientras se carga la fuente
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/home.png')} style={styles.backgroundImage}>
        <View style={[styles.overlay, styles.contentContainer]}>
          <Text style={[styles.title, { fontFamily: 'Cafe' }]}>
            <Text style={styles.vocab}>Vocab</Text>
            <Text style={styles.plus}>Plus</Text>
          </Text>
          <Paragraph style={styles.welcomeText}>¡Bienvenido a la mejor forma de aprender vocabulario en inglés!</Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Category')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Comenzar a Aprender
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo negro semitransparente para el overlay
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 48,
    marginBottom: 10,
    marginTop: 40,
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra del texto
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  vocab: {
    color: '#B0C4DE', // Tono azulado blanco
  },
  plus: {
    color: 'white', // Blanco completo
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra del texto
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d32f2f', // Tono de rojo más suave
    shadowColor: '#000', // Sombra del botón
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android, agrega un poco de elevación
  },
  buttonLabel: {
    color: 'white', // Asegúrate de que el texto del botón sea legible
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default HomeScreen;