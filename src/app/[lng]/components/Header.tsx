import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BookOpen, LogIn, LogOut, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams } from "next/navigation";

interface HeaderProps {
  currentView: "news" | "vocabulary";
  onViewChange: (view: "news" | "vocabulary") => void;
}

export const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const { user, login, logout, updateUserLevel } = useAuth();
  const [locale, setLocale] = useState("en");
  const { t } = useTranslation("common");
  const params = useParams();

  return (
    <header className="border-b border-shiba-teal/20 bg-white/80 backdrop-blur-md shadow-lg shadow-shiba-teal/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full overflow-hidden bg-shiba-teal/10 p-1"
                style={{ width: "50px", height: "50px" }}
              >
                <ImageWithFallback
                  src="/assets/logo.jpg"
                  alt="Shiba Lingo Logo"
                  style={{ borderRadius: "50%" }}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-shiba-navy tracking-wide">
                SHIBA LINGO
              </span>
            </div>

            {user && (
              <nav className="flex space-x-2">
                <Button
                  variant={currentView === "news" ? "default" : "ghost"}
                  onClick={() => onViewChange("news")}
                  className={
                    currentView === "news"
                      ? "bg-shiba-teal hover:bg-shiba-dark-teal text-white"
                      : "text-shiba-navy hover:bg-shiba-teal/10 hover:text-shiba-dark-teal"
                  }
                >
                  {t("header.news")}
                </Button>
                <Button
                  variant={currentView === "vocabulary" ? "default" : "ghost"}
                  onClick={() => onViewChange("vocabulary")}
                  className={
                    currentView === "vocabulary"
                      ? "bg-shiba-orange hover:bg-shiba-orange/90 text-white"
                      : "text-shiba-navy hover:bg-shiba-orange/10 hover:text-shiba-orange"
                  }
                >
                  {t("header.myVocabulary")}
                </Button>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Select
                  value={user.level}
                  onValueChange={(value) =>
                    updateUserLevel(
                      value as "beginner" | "intermediate" | "advanced"
                    )
                  }
                >
                  <SelectTrigger className="w-36 border-shiba-teal/30 bg-white/50 backdrop-blur-sm hover:border-shiba-teal text-shiba-navy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-shiba-teal/20">
                    <SelectItem
                      value="beginner"
                      className="text-shiba-navy hover:bg-shiba-teal/10"
                    >
                      {t("header.beginner")}
                    </SelectItem>
                    <SelectItem
                      value="intermediate"
                      className="text-shiba-navy hover:bg-shiba-orange/10"
                    >
                      {t("header.intermediate")}
                    </SelectItem>
                    <SelectItem
                      value="advanced"
                      className="text-shiba-navy hover:bg-purple-100"
                    >
                      {t("header.advanced")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  {user.avatar && (
                    <Avatar className="ring-2 ring-shiba-teal/20 ring-offset-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-shiba-teal text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="hidden sm:block font-medium text-shiba-navy">
                    {user.name}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-shiba-orange/50 text-shiba-orange hover:bg-shiba-orange hover:text-black transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("header.logout")}
                </Button>
              </>
            ) : (
              <Button
                onClick={login}
                className="bg-shiba-teal hover:bg-shiba-dark-teal text-white shadow-lg shadow-shiba-teal/20 rounded-xl"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t("header.loginWithGoogle")}
              </Button>
            )}
            <Select
              value={params.lng as string}
              onValueChange={(value) => {
                setLocale(value as "en" | "de" | "zh");
                location.href = `./${value}`;
              }}
            >
              <SelectTrigger className="w-36 border-shiba-teal/30 bg-white/50 backdrop-blur-sm hover:border-shiba-teal text-shiba-navy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-shiba-teal/20">
                <SelectItem
                  value="en"
                  className="text-shiba-navy hover:bg-shiba-teal/10"
                >
                  English
                </SelectItem>
                <SelectItem
                  value="de"
                  className="text-shiba-navy hover:bg-shiba-orange/10"
                >
                  Español
                </SelectItem>
                <SelectItem
                  value="zh"
                  className="text-shiba-navy hover:bg-purple-100"
                >
                  中文
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};
