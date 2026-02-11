import { useCallback, useEffect, useState } from 'react';

export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  
  const speak = useCallback((text: string) => {
    // Return a Promise so we can 'await' the speech in our game logic
    return new Promise((resolve) => {
      // Cancel any current speech immediately
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // CHIC VOICE PRIORITY LIST
      const preferredVoice = voices.find(v => v.name === 'Google US English') ||
                            voices.find(v => v.name.includes('Samantha')) ||
                            voices.find(v => v.name.includes('Aria')) ||
                            voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // TEACHER-STYLE SETTINGS
      utterance.pitch = 1.1; 
      utterance.rate = 0.9;  
      utterance.volume = 1;

      // When the person finishes the sentence, resolve the promise
      utterance.onend = () => {
        resolve(true);
      };

      // If there's an error, resolve anyway so the game doesn't "get stuck"
      utterance.onerror = () => {
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [voices]);

  return { speak };
};