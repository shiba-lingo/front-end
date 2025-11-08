import { useState } from 'react';
import { NewsArticle } from '../types';
import { useVocabulary } from '../hooks/useVocabulary';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, BookOpen, MessageSquare, Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ArticleReaderProps {
  article: NewsArticle;
  onBack: () => void;
}

export const ArticleReader = ({ article, onBack }: ArticleReaderProps) => {
  const { addVocabularyWord, addSavedSentence, isWordSaved } = useVocabulary();
  const [selectedText, setSelectedText] = useState('');
  const [showVocabDialog, setShowVocabDialog] = useState(false);
  const [showSentenceDialog, setShowSentenceDialog] = useState(false);
  const [definition, setDefinition] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
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
        articleTitle: article.title
      });
      setSelectedText('');
      setDefinition('');
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
        articleTitle: article.title
      });
      setSelectedText('');
      setShowSentenceDialog(false);
    }
  };

  const getSentenceContainingWord = (word: string) => {
    const sentences = article.content.split(/[.!?]+/);
    const sentence = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
    return sentence ? sentence.trim() + '.' : '';
  };

  const getContextAroundSentence = (sentence: string) => {
    const sentences = article.content.split(/[.!?]+/);
    const index = sentences.findIndex(s => s.includes(sentence));
    const start = Math.max(0, index - 1);
    const end = Math.min(sentences.length, index + 2);
    return sentences.slice(start, end).join('. ') + '.';
  };

  const highlightText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
      const isSaved = cleanWord && isWordSaved(cleanWord);
      
      return (
        <span
          key={index}
          className={isSaved ? 'bg-yellow-200 cursor-pointer' : ''}
          title={isSaved ? 'Saved vocabulary word' : ''}
        >
          {word}
        </span>
      );
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
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
              <span>{article.readingTime} min read</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">{article.summary}</p>
            
            <div 
              className="text-lg leading-relaxed space-y-4"
              onMouseUp={handleTextSelection}
            >
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-800">
                  {highlightText(paragraph.trim())}
                </p>
              ))}
            </div>
          </div>

          {selectedText && (
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
              <p className="text-sm mb-3">
                Selected: <span className="font-medium">{selectedText}</span>
              </p>
              <div className="flex space-x-2">
                <Dialog open={showVocabDialog} onOpenChange={setShowVocabDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Add to Vocabulary
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Vocabulary Word</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Word</label>
                        <Input value={selectedText} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Definition</label>
                        <Textarea
                          value={definition}
                          onChange={(e) => setDefinition(e.target.value)}
                          placeholder="Enter the definition..."
                        />
                      </div>
                      <Button onClick={handleAddVocabulary} disabled={!definition}>
                        Save Word
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showSentenceDialog} onOpenChange={setShowSentenceDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Save Sentence
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Sentence</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Selected Text</label>
                        <Textarea value={selectedText} disabled />
                      </div>
                      <Button onClick={handleAddSentence}>
                        Save Sentence
                      </Button>
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