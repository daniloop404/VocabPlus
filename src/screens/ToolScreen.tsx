import * as React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
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
        console.log("Sending audio feedback request...");
        response = await getFeedbackFromAudio(word.english, recordingURI);
      } else if (userInput) {
        console.log("Sending text feedback request...");
        response = await getFeedback(word.english, userInput);
      } else {
        console.warn("No audio or text input available for feedback");
        return;
      }
      
      console.log("Feedback response:", response);
      
      if (response && response.length > 0) {
        setFeedback(response[0].feedback);
        setPass(response[0].pass);
      } else {
        console.warn("Received empty response from feedback request");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

const startRecording = async () => {
    try {
      await AudioRecordingService.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
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
        console.log(`Recording saved: ${info.uri}, Size: ${info.size} bytes`);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };
  const playRecording = async () => {
    if (recordingURI) {
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: recordingURI });
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing recording:', error);
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
        <Text style={styles.example}>{exampleEng}</Text>
        <Text style={styles.example}>{exampleSpa}</Text>
        <Text style={styles.sentenceHelp}>{sentenceHelp}</Text>
        <IconButton
          icon="volume-high"
          size={30}
          onPress={playSound}
          style={styles.iconButton}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your sentence"
          value={userInput}
          onChangeText={setUserInput}
        />
       <TouchableOpacity
  style={[styles.button, (!audioReady && !userInput) ? styles.disabledButton : null]}
  onPress={handleUserInput}
  disabled={!audioReady && !userInput}
>
  <Text style={styles.buttonText}>Get Feedback</Text>
</TouchableOpacity>
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
          <TouchableOpacity
            style={styles.button}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
          </TouchableOpacity>
          {recordingInfo && (
            <TouchableOpacity
              style={styles.button}
              onPress={playRecording}
            >
              <Text style={styles.buttonText}>Play Recording</Text>
              {audioReady && (
  <Text style={styles.audioReadyText}>Audio Ready</Text>
)}
            </TouchableOpacity>
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
  image: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: 'gray' },
  example: { fontSize: 16, marginVertical: 10, textAlign: 'center', paddingHorizontal: 20 },
  sentenceHelp: { fontSize: 16, marginVertical: 10, fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 20 },
  iconButton: { marginTop: 20 },
  input: { width: '80%', padding: 10, borderColor: 'gray', borderWidth: 1, marginBottom: 10 },
  button: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
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
  disabledButton: {
    backgroundColor: 'gray',
  },
  feedback: { 
    fontSize: 16, 
    marginRight: 10, 
    flexShrink: 1,
    textAlign: 'center'
  },
  recordContainer: { marginTop: 20, width: '100%', alignItems: 'center' },
});

export default ToolScreen;