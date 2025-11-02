import { NewsArticle } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Clock, Calendar, BookOpen, Brain, Zap, Star, TrendingUp, Target } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

export const NewsCard = ({ article, onClick }: NewsCardProps) => {
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          color: 'bg-shiba-teal/10 text-shiba-dark-teal border-shiba-teal/30',
          icon: Target,
          gradient: 'from-shiba-cream to-shiba-teal/5',
          progress: 33,
          description: 'Perfect for starting your journey'
        };
      case 'intermediate':
        return {
          color: 'bg-shiba-orange/10 text-orange-800 border-shiba-orange/30',
          icon: TrendingUp,
          gradient: 'from-shiba-cream to-shiba-orange/5',
          progress: 66,
          description: 'Build your confidence'
        };
      case 'advanced':
        return {
          color: 'bg-shiba-navy/10 text-shiba-navy border-shiba-navy/30',
          icon: Brain,
          gradient: 'from-shiba-cream to-shiba-navy/5',
          progress: 100,
          description: 'Challenge your skills'
        };
      default:
        return {
          color: 'bg-shiba-teal/10 text-shiba-navy border-shiba-teal/20',
          icon: BookOpen,
          gradient: 'from-shiba-cream to-white',
          progress: 50,
          description: 'Learning material'
        };
    }
  };

  const levelInfo = getLevelInfo(article.level);
  const LevelIcon = levelInfo.icon;
  
  // Estimate vocabulary complexity based on content
  const getVocabularyComplexity = () => {
    const wordCount = article.content.split(' ').length;
    const avgWordLength = article.content.split(' ').reduce((acc, word) => acc + word.length, 0) / wordCount;
    
    if (avgWordLength > 6) return { level: 'Rich', icon: Star, color: 'text-shiba-navy' };
    if (avgWordLength > 4.5) return { level: 'Moderate', icon: Zap, color: 'text-shiba-orange' };
    return { level: 'Simple', icon: BookOpen, color: 'text-shiba-teal' };
  };

  const vocabInfo = getVocabularyComplexity();

  return (
    <Card className={`cursor-pointer hover:shadow-xl hover:shadow-shiba-teal/20 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br ${levelInfo.gradient} border-2 hover:border-shiba-teal/40 relative overflow-hidden rounded-2xl`} onClick={onClick}>
      {/* Learning Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-shiba-teal/20">
        <div 
          className="h-full bg-gradient-to-r from-shiba-teal to-shiba-orange transition-all duration-500 group-hover:from-shiba-dark-teal group-hover:to-shiba-orange"
          style={{ width: `${levelInfo.progress}%` }}
        />
      </div>

      {/* Difficulty Badge Corner */}
      <div className="absolute top-3 right-3 z-10">
        <div className={`rounded-full p-2 ${levelInfo.color} border-2 shadow-sm backdrop-blur-sm bg-white/80`}>
          <LevelIcon className="h-3 w-3" />
        </div>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative group">
        <ImageWithFallback
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with Learning Hints */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 text-white text-xs">
              <vocabInfo.icon className={`h-3 w-3 ${vocabInfo.color}`} />
              <span>{vocabInfo.level} vocabulary</span>
              <span className="text-white/70">•</span>
              <span className="text-white/90">{levelInfo.description}</span>
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${levelInfo.color} border font-medium shadow-sm`}>
            <LevelIcon className="h-3 w-3 mr-1" />
            {article.level}
          </Badge>
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">{article.category}</Badge>
        </div>
        
        {/* Learning Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Learning Difficulty</span>
            <span>{levelInfo.progress}%</span>
          </div>
          <Progress value={levelInfo.progress} className="h-2 bg-white/80" />
        </div>
        
        <h3 className="font-semibold line-clamp-2 text-shiba-navy group-hover:text-shiba-dark-teal transition-colors">{article.title}</h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-shiba-navy/70 text-sm line-clamp-3 mb-4 group-hover:text-shiba-navy transition-colors">{article.summary}</p>
        
        {/* Enhanced Footer with Learning Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-shiba-navy/60">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{article.readingTime} min</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-shiba-teal group-hover:text-shiba-dark-teal transition-colors">
              <BookOpen className="h-3 w-3" />
              <span className="font-medium">Start Reading</span>
            </div>
          </div>
          
          {/* Learning Benefits */}
          <div className="flex items-center space-x-4 text-xs text-shiba-navy/60 pt-2 border-t border-shiba-teal/10">
            <div className="flex items-center space-x-1">
              <vocabInfo.icon className={`h-3 w-3 ${vocabInfo.color}`} />
              <span>{vocabInfo.level} vocab</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3 text-shiba-orange" />
              <span>Skill building</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Subtle Learning Animation */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-shiba-teal/20 to-shiba-orange/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};