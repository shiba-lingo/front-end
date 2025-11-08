import { useState, useEffect } from "react";
import { VocabularyWord, SavedSentence } from "../types";
import apiClients from "../../../lib/apiClient";

export const useVocabulary = () => {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [savedSentences, setSavedSentences] = useState<SavedSentence[]>([]);

  const fetchVocabularies = async () => {
    try {
      const res = await apiClients.learning.get("/vocabularies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVocabularyWords(res.data.vocabularies);
    } catch (error) {
      console.error("fetch vocabularies failed: ", error);
    }
  };
  const fetchSentences = async () => {
    try {
      const res = await apiClients.learning.get("/sentences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedSentences(res.data.sentences);
    } catch (error) {
      console.error("fetch sentences failed: ", error);
    }
  };

  useEffect(() => {
    fetchVocabularies();
    fetchSentences();
  }, []);

  const token = localStorage.getItem("user_token");

  const addVocabularyWord = async (props: {
    word: string;
    definition: string;
    sentence: string;
    articleId: string;
    articleTitle: string;
  }) => {
    try {
      await apiClients.learning.post(
        "/vocabularies",
        {
          word: props.word,
          definition: props.definition,
          sentence: props.sentence,
          articleId: props.articleId,
          articleTitle: props.articleTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("add vocabulary failed: ", error);
    }
  };

  const addSavedSentence = async (sentence: {
    sentence: string;
    context: string;
    articleId: string;
    articleTitle: string;
  }) => {
    try {
      await apiClients.learning.post(
        "/sentences",
        {
          sentence: sentence.sentence,
          context: sentence.context,
          articleId: sentence.articleId,
          articleTitle: sentence.articleTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("add vocabulary failed: ", error);
    }
  };

  const removeVocabularyWord = async (id: string) => {
    try {
      await apiClients.learning.delete(`/vocabularies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedWords = vocabularyWords.filter((word) => word._id !== id);
      setVocabularyWords(updatedWords);
    } catch (error) {
      console.error("delete vocabulary failed: ", error);
    }
  };

  const removeSavedSentence = async (id: string) => {
    try {
      await apiClients.learning.delete(`/sentences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedSentences = savedSentences.filter(
        (sentence) => sentence._id !== id
      );
      setSavedSentences(updatedSentences);
    } catch (error) {
      console.error("delete sentence failed: ", error);
    }
  };

  const isWordSaved = (word: string) => {
    return vocabularyWords.some(
      (vocabWord) => vocabWord.word.toLowerCase() === word.toLowerCase()
    );
  };

  return {
    vocabularyWords,
    savedSentences,
    addVocabularyWord,
    addSavedSentence,
    removeVocabularyWord,
    removeSavedSentence,
    isWordSaved,
  };
};
