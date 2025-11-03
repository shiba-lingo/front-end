import { useState, useMemo } from "react";
import { NewsArticle } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { NewsCard } from "./NewsCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Search, Filter, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NewsFeedProps {
  articles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export const NewsFeed = ({ articles, onArticleClick }: NewsFeedProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { t } = useTranslation("common");

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(articles.map((article) => article.category))
    );
    return ["all", ...cats];
  }, [articles]);

  const levels = ["all", "beginner", "intermediate", "advanced"];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "all" || article.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [articles, searchTerm, selectedCategory, selectedLevel]);

  const recommendedArticles = useMemo(() => {
    if (!user) return filteredArticles;

    // Show articles matching user's level first, then others
    const userLevelArticles = filteredArticles.filter(
      (article) => article.level === user.level
    );
    const otherArticles = filteredArticles.filter(
      (article) => article.level !== user.level
    );

    return [...userLevelArticles, ...otherArticles];
  }, [filteredArticles, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* News Header Section with Background */}
      <div className="mb-12 bg-gradient-to-br from-white via-shiba-cream/30 to-shiba-light-teal/20 rounded-3xl p-8 shadow-lg shadow-shiba-teal/10 border border-shiba-teal/20 backdrop-blur-sm">
        {/* Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-shiba-navy bg-gradient-to-r from-shiba-navy to-shiba-dark-teal bg-clip-text text-transparent">
            {t("mainPage.title")}
          </h1>
          <p className="text-shiba-navy/80 text-lg">
            {user
              ? t("mainPage.userStats", {
                  level: user.level,
                  count: filteredArticles.length,
                })
              : t("mainPage.loginPrompt")}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-shiba-teal" />
            <Input
              placeholder="Search articles... 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-shiba-teal/30 bg-white/90 backdrop-blur-sm rounded-2xl focus:border-shiba-teal focus:ring-shiba-teal/20 shadow-sm"
            />
          </div>

          <div className="flex flex-col items-baseline flex-wrap gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-shiba-teal/30 shadow-sm">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-shiba-teal" />
              <span className="font-medium text-shiba-navy">
                {t("mainPage.filters")}:
              </span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-shiba-navy/70">
                {t("mainPage.level")}:
              </span>
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={
                    selectedLevel === level
                      ? "bg-shiba-teal hover:bg-shiba-dark-teal text-white rounded-xl"
                      : "border-shiba-teal/30 text-shiba-navy hover:bg-shiba-teal/10 rounded-xl"
                  }
                >
                  {level === "all"
                    ? t("mainPage.allLevels")
                    : level === "beginner"
                    ? t("header.beginner")
                    : level === "intermediate"
                    ? t("header.intermediate")
                    : t("header.advanced")}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-shiba-navy/70">
                {t("mainPage.category")}:
              </span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-shiba-orange hover:bg-shiba-orange/90 text-white rounded-xl"
                      : "border-shiba-orange/30 text-shiba-navy hover:bg-shiba-orange/10 rounded-xl"
                  }
                >
                  {category === "all" ? t("mainPage.allCategories") : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Articles */}
      {user &&
        selectedLevel === "all" &&
        selectedCategory === "all" &&
        !searchTerm && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-shiba-teal to-shiba-orange rounded-2xl shadow-lg shadow-shiba-teal/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-shiba-navy">
                  {t("mainPage.recommendedForYou")}
                </h2>
                <p className="text-sm text-shiba-navy/70">
                  {t("mainPage.userLevelPrompt", { level: user.level })}
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedArticles
                .filter((article) => article.level === user.level)
                .slice(0, 3)
                .map((article, index) => (
                  <div
                    key={article.id}
                    className="animate-in fade-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <NewsCard
                      article={article}
                      onClick={() => onArticleClick(article)}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* All Articles */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-shiba-navy">
          {user &&
          selectedLevel === "all" &&
          selectedCategory === "all" &&
          !searchTerm
            ? "📚 All Articles"
            : `📖 Articles (${recommendedArticles.length})`}
        </h2>
      </div>

      {recommendedArticles.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-shiba-teal/20">
            <Search className="h-16 w-16 mx-auto mb-4 text-shiba-teal/50" />
            <p className="text-shiba-navy font-medium mb-2">
              {t("mainPage.noArticlesFoundMatchingYourCriteria")}
            </p>
            <p className="text-sm text-shiba-navy/70">
              {t("mainPage.tryAdjustingYourFiltersOrSearchTerms")}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedArticles.map((article, index) => (
            <div
              key={article.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard
                article={article}
                onClick={() => onArticleClick(article)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
