import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
// Verificar que la clave API no sea undefined
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("La clave API de Gemini no está definida. Por favor, configura la variable de entorno GEMINI_API_KEY.");
}
let chatSession: ChatSession | undefined; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    Tu tarea es ayudar a la comprensión del vocabulario en inglés a un hispanohablante, para eso tienes que tomar en cuenta la tarea(task) actual:
    Task1: SentenceExample: En esta tarea generarás una oración corta con la palabra actual(currentWord) en inglés devuelto en el campo de SentenceEng y la oración en español devuelto en SentenceSpa.
    SentenceGeneration: Aquí debes dar al usuario una idea o tema donde el usuario debe utilizar la palabra(currentWord) lo cual devolverás en "SentenceHelp".
    Task2: Feedback: En esta tarea recibirás un audio o un texto por parte del usuario y deberás dar un feedback, transcribe primero la oracion, si consideras que la oración está bien estructurada en "pass" pondrás "good", si consideras que está mal pondrás "bad", si es "good" le das algún tip adicional si es "bad" le indicas los errores, aquí la salida es en español para que incluso usuarios con poco conocimiento en inglés puedan entender, pero recuerda que tanto el audio como el texto debe estar en ingles, si el usuario dice algo en otro idioma dile que porfavor haga la oracion en ingles.

    Devuelve la salida en un arreglo json.
    [
        {
            "ExampleEng": "", //solo para task1
            "ExampleSpa": "", //solo para task1
            "SentenceHelp": "", //solo para task1
            "feedback": "", //solo para task2
            "pass": "" //solo para task2
        }
    ]`,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};



export async function getChatSession() {
    try {
      if (!chatSession) {
        chatSession = await model.startChat({
          generationConfig, 
          history: [],
        });
      }
      return chatSession;
    } catch (error) {
      console.error("Error starting or getting chat session:", error);
      throw error; 
    }
  }
export async function startChat() {
    try {
        const chatSession = await model.startChat({
            generationConfig,
            history: [],
        });

        return chatSession;
    } catch (error) {
        console.error("Error starting chat session:", error);
        throw error;
    }
}

export async function getSentenceExample(word: string) {
    try {
      const session = await getChatSession(); // Get the session
      const result = await session.sendMessage(JSON.stringify([{ Task: "Task1", "Current word": word, "User output": "" }]));

        const responseText = await result.response.text();
        const cleanedText = responseText.startsWith("```json\n") ? responseText.slice("```json\n".length) : responseText;

        // Encontrar la posición del primer ']'
        const endIndex = cleanedText.indexOf(']');
        
        // Verificar si se encontró ']'
        if (endIndex !== -1) {
            // Extraer la subcadena desde el inicio hasta ']'
            const validJsonString = cleanedText.substring(0, endIndex + 1);
            console.log("JSON válido:", validJsonString);
            return JSON.parse(validJsonString);
        } else {
            // Manejar el caso en que no se encuentre ']'
            console.error("Error: No se encontró un JSON válido en la respuesta.");
            return null;
        }
    } catch (error) {
        console.error("Error in getSentenceExample:", error);
        throw error;
    }
}

export async function getFeedbackFromAudio(word: string, audioUri: string) {
    try {
      const session = await getChatSession(); // Get the session
  
      const audioFileBase64 = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64, 
      });
  
      const result = await session.sendMessage([
        { text: JSON.stringify([{ Task: "Task2", "Current word": word, "User output": "" }]) },
        {
          inlineData: {
            mimeType: 'audio/wav', 
            data: audioFileBase64, 
          },
        },
      ]);
  
      const responseText = result.response.text();
      console.log("Raw response:", responseText);

        const cleanedText = responseText.startsWith("```json\n") ? responseText.slice("```json\n".length) : responseText;

        // Encontrar la posición del primer ']'
        const endIndex = cleanedText.indexOf(']');
        
        // Verificar si se encontró ']'
        if (endIndex !== -1) {
            // Extraer la subcadena desde el inicio hasta ']'
            const validJsonString = cleanedText.substring(0, endIndex + 1);
            console.log("JSON válido:", validJsonString);
            return JSON.parse(validJsonString);
        } else {
            // Manejar el caso en que no se encuentre ']'
            console.error("Error: No se encontró un JSON válido en la respuesta.");
            return null;
        }
    } catch (error) {
        console.error("Error in getFeedbackFromAudio:", error);
        throw error;
    }
}

export async function getFeedback(word: string, userOutput: string) {
    try {
        const chatSession = await startChat();
        const result = await chatSession.sendMessage(JSON.stringify([{ Task: "Task2", "Current word": word, "User output": userOutput }]));

        const responseText = await result.response.text();
        const cleanedText = responseText.startsWith("```json\n") ? responseText.slice("```json\n".length) : responseText;

        // Encontrar la posición del primer ']'
        const endIndex = cleanedText.indexOf(']');
        
        // Verificar si se encontró ']'
        if (endIndex !== -1) {
            // Extraer la subcadena desde el inicio hasta ']'
            const validJsonString = cleanedText.substring(0, endIndex + 1);
            console.log("JSON válido:", validJsonString);
            return JSON.parse(validJsonString);
        } else {
            // Manejar el caso en que no se encuentre ']'
            console.error("Error: No se encontró un JSON válido en la respuesta.");
            return null;
        }
    } catch (error) {
        console.error("Error in getFeedback:", error);
        throw error;
    }
}