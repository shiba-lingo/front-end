export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  readingTime: number;
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  articleId: string;
  articleTitle: string;
  createdAt: string;
}

export interface SavedSentence {
  id: string;
  sentence: string;
  context: string;
  articleId: string;
  articleTitle: string;
  createdAt: string;
}