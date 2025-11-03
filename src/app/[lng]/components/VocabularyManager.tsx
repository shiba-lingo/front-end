import { useState } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Trash2, Search, BookOpen, MessageSquare } from 'lucide-react';

export const VocabularyManager = () => {
  const { vocabularyWords, savedSentences, removeVocabularyWord, removeSavedSentence } = useVocabulary();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = vocabularyWords.filter(word =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSentences = savedSentences.filter(sentence =>
    sentence.sentence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sentence.context.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Vocabulary</h1>
        <p className="text-gray-600">Track your progress and review saved words and sentences</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vocabulary and sentences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="vocabulary" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vocabulary" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Vocabulary ({vocabularyWords.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sentences" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Sentences ({savedSentences.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary" className="mt-6">
          {filteredWords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No vocabulary words yet</h3>
                <p className="text-gray-500 text-center">
                  Start reading articles and save words to build your vocabulary
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWords.map((word) => (
                <Card key={word.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{word.word}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVocabularyWord(word.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{word.definition}</p>
                    
                    {word.sentence && (
                      <blockquote className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r text-sm mb-3">
                        {word.sentence}
                      </blockquote>
                    )}
                    
                    <div className="flex flex-col space-y-2 text-xs text-gray-500">
                      <Badge variant="outline" className="w-fit">
                        {word.articleTitle}
                      </Badge>
                      <span>{new Date(word.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sentences" className="mt-6">
          {filteredSentences.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No saved sentences yet</h3>
                <p className="text-gray-500 text-center">
                  Start reading articles and save useful sentences for reference
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSentences.map((sentence) => (
                <Card key={sentence.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline">{sentence.articleTitle}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedSentence(sentence.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <blockquote className="border-l-4 border-green-200 pl-4 py-2 bg-green-50 rounded-r mb-4">
                      <p className="font-medium">{sentence.sentence}</p>
                    </blockquote>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Context:</strong> {sentence.context}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Saved on {new Date(sentence.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};