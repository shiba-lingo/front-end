import { useState } from "react";
import { NewsArticle, WordData } from "../types";
import { useVocabulary } from "../hooks/useVocabulary";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface ArticleReaderProps {
  article: NewsArticle;
  onBack: () => void;
}

interface WordDefinitionProps {
  data: WordData | null;
}

export const ArticleReader = ({ article, onBack }: ArticleReaderProps) => {
  const { addVocabularyWord, addSavedSentence, isWordSaved } = useVocabulary();
  const [selectedText, setSelectedText] = useState("");
  const [textSearchResult, setTextSearchResult] = useState<WordData | null>(
    null
  );
  const [showVocabDialog, setShowVocabDialog] = useState(false);
  const [showSentenceDialog, setShowSentenceDialog] = useState(false);
  const [definition, setDefinition] = useState("");
  const { t } = useTranslation("common");

  function isEnglishWordFormat(str: string) {
    return /^[a-zA-Z]+[-']?[a-zA-Z]*$/.test(str);
  }

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    setTextSearchResult(null);
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());

      const word = selection.toString().trim() || "";
      if (isEnglishWordFormat(word)) {
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_DICTIONARY_API}/en/${selection}`
        );
        const data = await result.data[0];
        setTextSearchResult(data);
      }
    }
  };

  const handleAddVocabulary = () => {
    if (selectedText && definition) {
      const sentence = getSentenceContainingWord(selectedText);
      addVocabularyWord({
        word: selectedText,
        definition,
        sentence,
        articleId: article._id,
        articleTitle: article.title,
      });
      setSelectedText("");
      setDefinition("");
      setShowVocabDialog(false);
    }
  };

  const handleAddSentence = () => {
    if (selectedText) {
      const context = getContextAroundSentence(selectedText);
      addSavedSentence({
        sentence: selectedText,
        context,
        articleId: article._id,
        articleTitle: article.title,
      });
      setSelectedText("");
      setShowSentenceDialog(false);
    }
  };

  const getSentenceContainingWord = (word: string) => {
    const sentences = article.content.split(/[.!?]+/);
    const sentence = sentences.find((s) =>
      s.toLowerCase().includes(word.toLowerCase())
    );
    return sentence ? sentence.trim() + "." : "";
  };

  const getContextAroundSentence = (sentence: string) => {
    const sentences = article.content.split(/[.!?]+/);
    const index = sentences.findIndex((s) => s.includes(sentence));
    const start = Math.max(0, index - 1);
    const end = Math.min(sentences.length, index + 2);
    return sentences.slice(start, end).join(". ") + ".";
  };

  const highlightText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
      const isSaved = cleanWord && isWordSaved(cleanWord);

      return (
        <span
          key={index}
          className={isSaved ? "bg-yellow-200 cursor-pointer" : ""}
          title={isSaved ? "Saved vocabulary word" : ""}
        >
          {word}
        </span>
      );
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const WordDefinition = ({ data }: WordDefinitionProps) => {
    if (!data) return null;
    const audioSource = data.phonetics?.find(
      (p) => p.audio && p.audio !== ""
    )?.audio;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-4 max-h-[250px] overflow-y-auto ">
        <div className="flex items-baseline gap-4 mb-4">
          <h4 className="text-4xl font-bold text-gray-800 capitalize">
            {data.word}
          </h4>
          <span className="text-xl text-purple-600 font-mono">
            {data.phonetic || data.phonetics[0]?.text}
          </span>
        </div>

        {audioSource && (
          <div className="mb-6">
            <audio controls className="w-full h-10">
              <source src={audioSource} type="audio/mpeg" />
              {t("reader.notSupportAudio")}
            </audio>
          </div>
        )}

        <hr className="my-4 border-gray-200" />

        <div className="space-y-6">
          {data.meanings.map((meaning, index) => (
            <div key={`${meaning.partOfSpeech}-${index}`}>
              <h5 className="text-lg font-bold text-gray-700 italic mb-2">
                {meaning.partOfSpeech}
              </h5>
              <ul className="list-disc list-outside pl-5 space-y-1">
                {meaning.definitions.map((def, idx) => (
                  <li key={idx} className="text-gray-600 leading-relaxed">
                    {def.definition}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
         {t("reader.backToNews")}
      </Button>

      <article className="bg-white rounded-lg shadow-sm">
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={getLevelColor(article.level)}>
              {article.level}
            </Badge>
            <Badge variant="outline">{article.category}</Badge>
          </div>

          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} {t("reader.minRead")}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">{article.summary}</p>

            <div
              className="text-lg leading-relaxed space-y-4"
              onMouseUp={handleTextSelection}
            >
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-gray-800">
                  {highlightText(paragraph.trim())}
                </p>
              ))}
            </div>
          </div>

          {selectedText && (
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
              <p className="text-sm mb-3">
                {t("reader.selected")}: <span className="font-medium">{selectedText}</span>
              </p>
              {textSearchResult &&
                Object.keys(textSearchResult).length !== 0 && (
                  <WordDefinition data={textSearchResult} />
                )}
              <div className="flex space-x-2">
                <Dialog
                  open={showVocabDialog}
                  onOpenChange={setShowVocabDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {t("reader.addToVocabulary")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("reader.addVocabularyWord")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">{t("reader.word")}</label>
                        <Input value={selectedText} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          {t("reader.definition")}
                        </label>
                        <Textarea
                          value={definition}
                          onChange={(e) => setDefinition(e.target.value)}
                          placeholder={t('reader.enterDefinition')} 
                        />
                      </div>
                      <Button
                        onClick={handleAddVocabulary}
                        disabled={!definition}
                      >
                        {t("reader.saveWord")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={showSentenceDialog}
                  onOpenChange={setShowSentenceDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t("reader.saveSentence")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("reader.saveSentence")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          {t("reader.selectedText")}
                        </label>
                        <Textarea value={selectedText} disabled />
                      </div>
                      <Button onClick={handleAddSentence}>{t("reader.saveSentence")}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
