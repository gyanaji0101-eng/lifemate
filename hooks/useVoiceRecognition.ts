
import { useState, useEffect, useCallback } from 'react';
import type { LanguageCode } from '../types';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;

export const useVoiceRecognition = (lang: LanguageCode) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }
    
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
  }, []);
  
  useEffect(() => {
    if (recognition) {
        recognition.lang = lang;
    }
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognition || isListening) return;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setTranscript('');
    setError('');
    setIsListening(true);
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [isListening]);

  return { isListening, transcript, error, isSupported, startListening, stopListening, setTranscript };
};
