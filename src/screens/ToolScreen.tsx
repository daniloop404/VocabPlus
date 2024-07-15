import * as React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text, IconButton, Button, Card, TextInput as PaperTextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../constants/types';
import { RouteProp } from '@react-navigation/native';
import AudioRecordingService from '../services/AudioRecordingService';
import { getSentenceExample, getFeedback, getFeedbackFromAudio } from '../services/GeminiService';

type ToolScreenRouteProp = RouteProp<RootStackParamList, 'Tool'>;

const ToolScreen: React.FC = () => {
  const route = useRoute<ToolScreenRouteProp>();
  const { word } = route.params;

  const [recordingURI, setRecordingURI] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [recordingInfo, setRecordingInfo] = React.useState<{ uri: string, size: number } | null>(null);
  const [audioReady, setAudioReady] = React.useState<boolean>(false);
  const [exampleEng, setExampleEng] = React.useState<string>('');
  const [exampleSpa, setExampleSpa] = React.useState<string>('');
  const [sentenceHelp, setSentenceHelp] = React.useState<string>('');
  const [userInput, setUserInput] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState<string>('');
  const [pass, setPass] = React.useState<string>('');

  React.useEffect(() => {
    const fetchSentenceExample = async () => {
      try {
        const response = await getSentenceExample(word.english);
        if (response && response.length > 0) {
          setExampleEng(response[0].ExampleEng);
          setExampleSpa(response[0].ExampleSpa);
          setSentenceHelp(response[0].SentenceHelp);
        }
      } catch (error) {
        console.error("Error fetching sentence example:", error);
      }
    };

    fetchSentenceExample();
  }, [word]);

  const handleUserInput = async () => {
    try {
      let response;
      if (audioReady && recordingURI) {
        console.log("Enviando solicitud de retroalimentación de audio...");
        response = await getFeedbackFromAudio(word.english, recordingURI);
      } else if (userInput) {
        console.log("Enviando solicitud de retroalimentación de texto...");
        response = await getFeedback(word.english, userInput);
      } else {
        console.warn("No hay entrada de audio o texto disponible para retroalimentación");
        return;
      }
      
      console.log("Respuesta de retroalimentación:", response);
      
      if (response && response.length > 0) {
        setFeedback(response[0].feedback);
        setPass(response[0].pass);
      } else {
        console.warn("Recibida respuesta vacía de la solicitud de retroalimentación");
      }
    } catch (error) {
      console.error("Error al obtener la retroalimentación:", error);
    }
  };

  const startRecording = async () => {
    try {
      await AudioRecordingService.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error al empezar la grabación', err);
    }
  };

  const stopRecording = async () => {
    try {
      const uri = await AudioRecordingService.stopRecording();
      setIsRecording(false);
      if (uri) {
        setRecordingURI(uri);
        const info = await AudioRecordingService.getAudioInfo(uri);
        setRecordingInfo(info);
        setAudioReady(true);
        console.log(`Grabación guardada: ${info.uri}, Tamaño: ${info.size} bytes`);
      }
    } catch (err) {
      console.error('Error al detener la grabación', err);
    }
  };

  const playRecording = async () => {
    if (recordingURI) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: recordingURI });
        await sound.playAsync();
      } catch (error) {
        console.error('Error al reproducir la grabación:', error);
      }
    }
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(word.audio);
    await sound.playAsync();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={word.image} style={styles.image} />
        <Text style={styles.title}>{word.english}</Text>
        <Text style={styles.subtitle}>{word.spanish}</Text>
        
        <Card style={styles.exampleCard}>
          <Card.Title title="Oración en Inglés" />
          <Card.Content>
            <Text style={styles.example}>{exampleEng}</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.exampleCard}>
          <Card.Title title="Traducción al Español" />
          <Card.Content>
            <Text style={styles.example}>{exampleSpa}</Text>
          </Card.Content>
        </Card>

        <Text style={styles.sentenceHelp}>{sentenceHelp}</Text>
        <View style={styles.iconWithLabel}>
          <IconButton
            icon="volume-high"
            size={30}
            onPress={playSound}
            style={styles.iconButton}
          />
          <Text style={styles.label}>Reproducir Sonido</Text>
        </View>
        <Text style={styles.inputLabel}>Por favor escribe aquí una oración en inglés con la palabra {word.english}:</Text>
        <PaperTextInput
          mode="outlined"
          style={styles.input}
          placeholder="Ingrese su oración"
          value={userInput}
          onChangeText={setUserInput}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleUserInput}
          disabled={!audioReady && !userInput}
        >
          Obtener Retroalimentación
        </Button>
        {feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedback}>{feedback}</Text>
            <IconButton
              icon={pass === 'good' ? 'check-circle' : 'close-circle'}
              size={30}
              iconColor={pass === 'good' ? 'green' : 'red'}
            />
          </View>
        )}
        <View style={styles.recordContainer}>
          <Button
            mode="contained"
            style={[styles.button, styles.recordButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Detener Grabación' : 'Empezar Grabación'}
          </Button>
          {recordingInfo && (
            <Button
              mode="contained"
              style={styles.button}
              onPress={playRecording}
            >
              Reproducir Grabación
              {audioReady && (
                <Text style={styles.audioReadyText}>Audio Listo</Text>
              )}
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: { 
    width: 200, 
    height: 200, 
    marginBottom: 20,
    borderRadius: 100,
    borderColor: '#ADD8E6', // Azul claro
    borderWidth: 2,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#4682B4', // Azul más oscuro
  },
  subtitle: { 
    fontSize: 18, 
    color: '#708090', // Gris azulado
  },
  exampleCard: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#F5F5F5', // Gris claro
    borderColor: '#ADD8E6', // Azul claro
    borderWidth: 1,
    borderRadius: 10,
  },
  example: { 
    fontSize: 16, 
    textAlign: 'center',
    color: '#333333', // Gris oscuro
  },
  sentenceHelp: { 
    fontSize: 16, 
    marginVertical: 10, 
    fontStyle: 'italic', 
    textAlign: 'center', 
    paddingHorizontal: 20,
    color: '#4682B4', // Azul más oscuro
  },
  iconWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconButton: { 
    marginRight: 10,
    backgroundColor: '#ADD8E6', // Azul claro
  },
  label: { 
    fontSize: 16,
    color: '#4682B4', // Azul más oscuro
  },
  inputLabel: {
    width: '80%', 
    fontSize: 16, 
    marginVertical: 10, 
    textAlign: 'center',
    color: '#4682B4', // Azul más oscuro
  },
  input: { 
    width: '80%', 
    marginBottom: 10,
    borderColor: '#ADD8E6', // Azul claro
  },
  button: { 
    marginVertical: 10, 
    width: '80%', 
    alignItems: 'center',
    backgroundColor: '#ADD8E6', // Azul claro
  },
  feedbackContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  audioReadyText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
  },
  feedback: { 
    fontSize: 16, 
    marginRight: 10, 
    flexShrink: 1,
    textAlign: 'center'
  },
  recordContainer: { 
    marginTop: 20, 
    width: '100%', 
    alignItems: 'center' 
  },
  recordButton: {
    backgroundColor: '#FF7F7F', // Rojo claro
  }
});

export default ToolScreen;
