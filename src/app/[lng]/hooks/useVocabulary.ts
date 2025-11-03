import { useState, useEffect } from 'react';
import { VocabularyWord, SavedSentence } from '../types';

export const useVocabulary = () => {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [savedSentences, setSavedSentences] = useState<SavedSentence[]>([]);

  useEffect(() => {
    const storedWords = localStorage.getItem('vocabularyWords');
    const storedSentences = localStorage.getItem('savedSentences');
    
    if (storedWords) {
      setVocabularyWords(JSON.parse(storedWords));
    }
    
    if (storedSentences) {
      setSavedSentences(JSON.parse(storedSentences));
    }
  }, []);

  const addVocabularyWord = (word: Omit<VocabularyWord, 'id' | 'createdAt'>) => {
    const newWord: VocabularyWord = {
      ...word,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedWords = [...vocabularyWords, newWord];
    setVocabularyWords(updatedWords);
    localStorage.setItem('vocabularyWords', JSON.stringify(updatedWords));
  };

  const addSavedSentence = (sentence: Omit<SavedSentence, 'id' | 'createdAt'>) => {
    const newSentence: SavedSentence = {
      ...sentence,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedSentences = [...savedSentences, newSentence];
    setSavedSentences(updatedSentences);
    localStorage.setItem('savedSentences', JSON.stringify(updatedSentences));
  };

  const removeVocabularyWord = (id: string) => {
    const updatedWords = vocabularyWords.filter(word => word.id !== id);
    setVocabularyWords(updatedWords);
    localStorage.setItem('vocabularyWords', JSON.stringify(updatedWords));
  };

  const removeSavedSentence = (id: string) => {
    const updatedSentences = savedSentences.filter(sentence => sentence.id !== id);
    setSavedSentences(updatedSentences);
    localStorage.setItem('savedSentences', JSON.stringify(updatedSentences));
  };

  const isWordSaved = (word: string) => {
    return vocabularyWords.some(vocabWord => 
      vocabWord.word.toLowerCase() === word.toLowerCase()
    );
  };

  return {
    vocabularyWords,
    savedSentences,
    addVocabularyWord,
    addSavedSentence,
    removeVocabularyWord,
    removeSavedSentence,
    isWordSaved
  };
};