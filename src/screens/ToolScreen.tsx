import * as React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../constants/types';
import { RouteProp } from '@react-navigation/native';

type ToolScreenRouteProp = RouteProp<RootStackParamList, 'Tool'>;

const ToolScreen: React.FC = () => {
  const route = useRoute<ToolScreenRouteProp>();
  const { word } = route.params;

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(word.audio);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Image source={word.image} style={styles.image} />
      <Text style={styles.title}>{word.english}</Text>
      <Text style={styles.subtitle}>{word.spanish}</Text>
      <IconButton
        icon="volume-high"
        size={30}
        onPress={playSound}
        style={styles.iconButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 16,
  },
  iconButton: {
    marginTop: 16,
  },
});

export default ToolScreen;