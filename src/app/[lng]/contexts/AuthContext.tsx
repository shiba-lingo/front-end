import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { useRouter } from "next/navigation";
import apiClients from "../../../lib/apiClient";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  updateUserLevel: (level: "beginner" | "intermediate" | "advanced") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem("englishLearnerUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {

      const userData = await apiClients.user.post("/oauth/google", {
        code,
      });

      const token = userData.data.data.token;

      const profileRes = await apiClients.user.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userProfile = profileRes.data.data;

      const user = {
        id: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        token,
        avatar: userProfile.profileImage,
        level: userProfile.level,
      };
      setUser({
        ...user,
      });

      localStorage.setItem("englishLearnerUser", JSON.stringify(user));
      localStorage.setItem("user_token", token);
    },
    flow: "auth-code",
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("englishLearnerUser");
    localStorage.removeItem("vocabularyWords");
    localStorage.removeItem("savedSentences");
    localStorage.removeItem("user_token");
    googleLogout();
  };

  const updateUserLevel = (level: "beginner" | "intermediate" | "advanced") => {
    if (user) {
      const updatedUser = { ...user, level };
      setUser(updatedUser);
      localStorage.setItem("englishLearnerUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserLevel }}>
      {children}
    </AuthContext.Provider>
  );
};
