'use client'

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  BookOpen,
  FileText,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import apiClients from "../../lib/apiClient";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- TypeScript Interfaces based on your API Documentation ---

// 1. Content Service Types
interface Article {
  id: string;
  title: string;
  level: string; // 'Easy' | 'Medium' | 'Hard'
  category: string;
}

interface ArticlesResponse {
  data: Article[];
}

// 2. Learning Service Types (Vocabulary)
interface Vocabulary {
  id: string;
  word: string;
  note: string;
  // ... other fields
}

interface VocabulariesResponse {
  vocabularies: Vocabulary[];
}

// 3. Learning Service Types (Sentence)
interface Sentence {
  id: string;
  sentence: string;
  // ... other fields
}

// Assuming the structure matches vocabularies based on API patterns
interface SentencesResponse {
  sentences: Sentence[];
}

// 4. Dashboard State Interface
interface DashboardMetrics {
  totalUsers: number;
  totalVocabularies: number;
  totalSentences: number;
  totalArticles: number;
  articleDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

const Dashboard: React.FC = () => {
  // State for metrics
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalVocabularies: 0,
    totalSentences: 0,
    totalArticles: 0,
    articleDifficulty: { easy: 0, medium: 0, hard: 0 },
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // NOTE: In a real app, you would retrieve the JWT token from localStorage/Context
        const token = localStorage.getItem('user_token')
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // --- 1. Fetch Articles (Content Service: GET contents/) ---
        const articlesRes = await apiClients.content.get("/contents/", { headers });
        const articlesData: ArticlesResponse = await articlesRes.data;

        console.log(articlesData)

        // Logic: Calculate distribution based on 'level' field
        let easy = 0,
          medium = 0,
          hard = 0;
        articlesData.data.forEach((art) => {
          const lvl = art.level.toLowerCase();
          if (lvl === "easy") easy++;
          else if (lvl === "medium") medium++;
          else if (lvl === "hard") hard++;
        });

        // --- 2. Fetch Vocabularies (Learning Service: GET vocabularies) ---
        const vocabRes = await apiClients.learning.get("/vocabularies", { headers });
        const vocabData: VocabulariesResponse = await vocabRes.data;


        // --- 3. Fetch Sentences (Learning Service: GET sentences) ---
        const sentenceRes = await apiClients.learning.get("/sentences", { headers });
        // Assuming the response structure based on the vocabulary pattern
        const sentenceData: SentencesResponse = await sentenceRes.data;

        // --- 4. Total Users ---
        // NOTE: The provided User Service APIs (Register, Login, Profile)
        // DO NOT have an endpoint to get the "Total User Count" (e.g., GET /users).
        // I am using a mock value here. You would need an Admin API for this.
        const mockUserCount = 2;

        // Update State
        setMetrics({
          totalUsers: mockUserCount,
          totalVocabularies: vocabData.vocabularies.length,
          totalSentences: sentenceData.sentences?.length || 0, // Safely access length
          totalArticles: articlesData.data.length,
          articleDifficulty: { easy, medium, hard },
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        // Fallback or error state handling could be added here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Chart Configurations ---

  // Bar Chart Data: Article Difficulty
  const difficultyChartData: ChartData<"bar"> = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Article Count",
        data: [
          metrics.articleDifficulty.easy,
          metrics.articleDifficulty.medium,
          metrics.articleDifficulty.hard,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)", // Green
          "rgba(234, 179, 8, 0.7)", // Yellow
          "rgba(239, 68, 68, 0.7)", // Red
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut Chart Data: Resources (Vocab vs Sentences)
  const resourceChartData: ChartData<"doughnut"> = {
    labels: ["Vocabularies", "Sentences"],
    datasets: [
      {
        data: [metrics.totalVocabularies, metrics.totalSentences],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(168, 85, 247, 0.7)", // Purple
        ],
        borderColor: ["rgb(59, 130, 246)", "rgb(168, 85, 247)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar" | "doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading Dashboard Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">
          Real-time monitoring for User, Content, and Learning services
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Users"
          value={metrics.totalUsers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend="+12% this month"
        />
        <KPICard
          title="Total Vocabularies"
          value={metrics.totalVocabularies}
          icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          trend="Based on user input"
        />
        <KPICard
          title="Total Sentences"
          value={metrics.totalSentences}
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
          trend="Based on user input"
        />
        <KPICard
          title="Total Articles"
          value={metrics.totalArticles}
          icon={<Activity className="w-6 h-6 text-emerald-600" />}
          trend="Content Service"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Difficulty Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Article Difficulty Level
          </h2>
          <div className="h-64 flex justify-center">
            <Bar data={difficultyChartData} options={chartOptions} />
          </div>
        </div>

        {/* Secondary Chart: Resource Ratio */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Learning Resources
          </h2>
          <div className="h-64 flex justify-center">
            <Doughnut data={resourceChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KPI Card Component ---

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-center text-xs">
        <span className="text-green-600 font-medium flex items-center bg-green-50 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {trend}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
