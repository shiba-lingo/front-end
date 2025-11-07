"use client";

import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { NewsFeed } from "./components/NewsFeed";
import { ArticleReader } from "./components/ArticleReader";
import { VocabularyManager } from "./components/VocabularyManager";
import { mockNews } from "./data/mockNews";
import { NewsArticle } from "./types";
import { GoogleOAuthProvider } from "@react-oauth/google";


type View = "news" | "vocabulary" | "article";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("news");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setCurrentView("article");
  };

  const handleBackToNews = () => {
    setSelectedArticle(null);
    setCurrentView("news");
  };

  const handleViewChange = (view: "news" | "vocabulary") => {
    setCurrentView(view);
    setSelectedArticle(null);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-shiba-cream via-white to-shiba-light-teal/10">
          <Header
            currentView={currentView === "article" ? "news" : currentView}
            onViewChange={handleViewChange}
          />

          <main>
            {currentView === "news" && (
              <NewsFeed
                articles={mockNews}
                onArticleClick={handleArticleClick}
              />
            )}

            {currentView === "vocabulary" && <VocabularyManager />}

            {currentView === "article" && selectedArticle && (
              <ArticleReader
                article={selectedArticle}
                onBack={handleBackToNews}
              />
            )}
          </main>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
