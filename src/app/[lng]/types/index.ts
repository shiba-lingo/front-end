export interface User {
  id: string;
  token: string;
  name: string;
  email: string;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface NewsArticle {
  _id: string;
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
  _id: string;
  word: string;
  definition: string;
  sentence: string;
  articleId: string;
  articleTitle: string;
  createdAt: string;
}

export interface SavedSentence {
  _id: string;
  sentence: string;
  context: string;
  articleId: string;
  articleTitle: string;
  createdAt: string;
}