import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material';
import { WaveAnimation } from './components/WaveAnimation.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import type { Message } from './types.ts';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
      },
      background: {
        default: isDarkMode ? '#030712' : '#f8fafc',
        paper: isDarkMode ? '#111827' : '#ffffff',
      },
    },
  });

  const sendMessageToApi = async (message: string) => {
    setIsListening(false);
    try {
      const response = await fetch('http://localhost:7080/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      setError('Erreur lors de la communication avec l\'API');
      return null;
    }
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur. Veuillez utiliser Chrome, Edge ou Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'fr-FR';

    let silenceTimeout: NodeJS.Timeout | null = null;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('Aucune parole détectée. Veuillez réessayer.');
      } else if (event.error === 'audio-capture') {
        setError('Aucun microphone trouvé. Vérifiez qu\'il est branché et autorisé.');
      } else if (event.error === 'not-allowed') {
        setError('L\'accès au microphone a été refusé. Veuillez autoriser l\'accès pour utiliser cette fonctionnalité.');
      } else {
        setError(`Une erreur est survenue : ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };

    recognitionRef.current.onresult = async (event) => {
      let finalTranscript = '';
      let currentInterimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          currentInterimTranscript += transcript;
        }
      }

      if (currentInterimTranscript) {
        setInterimTranscript(currentInterimTranscript);
      }

      if (finalTranscript) {
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString(),
          content: finalTranscript,
          isUser: true,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Get API response
        const apiResponse = await sendMessageToApi(finalTranscript);
        if (apiResponse) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: apiResponse,
            isUser: false,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        }

        if (silenceTimeout) clearTimeout(silenceTimeout);
        silenceTimeout = setTimeout(() => {
          recognitionRef.current?.stop();
        }, 1000);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('La reconnaissance vocale n\'est pas supportée');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Impossible de démarrer la reconnaissance vocale. Veuillez réessayer.');
        setIsListening(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`flex h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isDarkMode={isDarkMode}
              />
            ))}
            {interimTranscript && (
              <div className="flex justify-end mb-4">
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
                } opacity-50`}>
                  {interimTranscript}
                </div>
              </div>
            )}
          </div>
          
          <div className={`p-6 border-t ${isDarkMode ? 'border-gray-900' : 'border-gray-200'}`}>
            <div className="max-w-3xl mx-auto">
              <div
                className={`${
                  isDarkMode ? 'bg-gray-900' : 'bg-white'
                } rounded-full p-8 cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20`}
                onClick={toggleListening}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <WaveAnimation isListening={isListening} />
                </div>
                <div className="relative z-10 flex items-center justify-center">
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-blue-500" />
                  ) : (
                    <Mic className="w-8 h-8 text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;