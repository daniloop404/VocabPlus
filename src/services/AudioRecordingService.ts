import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
const recordingOptions: Audio.RecordingOptions = {
    android: {
        extension: '.wav',
        // Antes: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP
        outputFormat: 1, // Valor numérico para THREE_GPP
        // Antes: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB
        audioEncoder: 1,  // Valor numérico para AMR_NB 
        sampleRate: 44100,
        numberOfChannels: 1, 
        bitRate: 128000,
      },
  ios: {
    extension: '.wav',
    audioQuality: 1,
    sampleRate: 44100,
    numberOfChannels: 1, // Monochannel as per API requirements
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/wav',
    bitsPerSecond: 128000,
  },
};

class AudioRecordingService {
    private recording: Audio.Recording | null = null;
  
    public async startRecording(): Promise<void> {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) throw new Error('Permission to access microphone is required.');
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      this.recording = recording;
    }
  
    public isRecording(): boolean {
      return this.recording !== null;
    }
  
    public async stopRecording(): Promise<string | null> {
      if (!this.recording) return null;
  
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      return uri;
    }
  
    public async getAudioInfo(uri: string): Promise<{ uri: string, size: number }> {
        try {
            const fileInfo = await (FileSystem.getInfoAsync as any)(uri);
          if (fileInfo.exists) {
            return {
              uri: fileInfo.uri,
              size: fileInfo.size || 0,
            };
          } else {
            throw new Error('Audio file does not exist');
          }
        } catch (error) {
          console.error('Error getting audio info:', error);
          return { uri: '', size: 0 };
        }
      }
    }
  
  export default new AudioRecordingService();