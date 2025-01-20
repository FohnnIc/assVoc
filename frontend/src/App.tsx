import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material';
import { WaveAnimation } from './components/WaveAnimation.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import type { Conversation, Message } from './types.ts';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  recognitionRef.current.onresult = (event) => {
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
      addMessage(finalTranscript, true);
      saveTranscript(finalTranscript); // Sauvegarde le texte détecté
      fakeApiCall(finalTranscript); // Fake un appel API avec le texte détecté

      // Réinitialiser le timer de silence après chaque mot détecté
      if (silenceTimeout) clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => {
        recognitionRef.current?.stop();
        addMessage('La détection de la parole est arrêtée en raison d\'une pause prolongée.', false);
      }, 3000); // 3 secondes sans activité
    }
  };

  return () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeout) clearTimeout(silenceTimeout);
  };
}, []);

// Fonction pour sauvegarder le texte détecté
const saveTranscript = (text: string) => {
  console.log('Transcript sauvegardé :', text);
  // Ici, tu peux sauvegarder dans un state, une base de données ou un fichier
};

// Fonction pour simuler un appel API
const fakeApiCall = async (text: string) => {
  console.log('Appel API avec le texte :', text);
  addMessage('Processing your request...', false);

  // Simulation d'une réponse API après 2 secondes
  setTimeout(() => {
    const fakeApiResponse = `Voici une réponse simulée pour : "${text}"`;
    addMessage(fakeApiResponse, false);
  }, 2000);
};

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
        if (!currentConversation) {
          createNewConversation();
        }
      } catch (err) {
        setError('Impossible de démarrer la reconnaissance vocale. Veuillez réessayer.');
        setIsListening(false);
      }
    }
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const addMessage = (content: string, isUser: boolean) => {
    if (!currentConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: Date.now(),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`flex h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Sidebar
          conversations={conversations}
          onSelectConversation={setCurrentConversation}
          onDeleteConversation={deleteConversation}
          onNewChat={createNewConversation}
          selectedId={currentConversation?.id}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {currentConversation?.messages.map(message => (
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