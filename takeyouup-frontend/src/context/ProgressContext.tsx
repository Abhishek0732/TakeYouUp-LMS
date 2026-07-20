import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/api/axios";
import { useAuth } from "./AuthContext";

export interface ProgressItem {
  itemType: string;
  itemId: string;
  completed: boolean;
}

interface ProgressContextType {
  progress: ProgressItem[];
  toggleProgress: (itemType: string, itemId: string) => Promise<void>;
  isCompleted: (itemType: string, itemId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress([]);
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const res = await api.get("/progress");
      setProgress(res.data);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  const toggleProgress = async (itemType: string, itemId: string) => {
    try {
      const res = await api.post("/progress/toggle", { itemType, itemId });
      const updatedItem = res.data;
      
      setProgress((prev) => {
        const existingIndex = prev.findIndex(p => p.itemType === itemType && p.itemId === itemId);
        if (existingIndex >= 0) {
          const newProgress = [...prev];
          if (updatedItem.completed) {
            newProgress[existingIndex] = updatedItem;
          } else {
            // Remove if it's toggled off
            newProgress.splice(existingIndex, 1);
          }
          return newProgress;
        } else {
          if (updatedItem.completed) {
            return [...prev, updatedItem];
          }
          return prev;
        }
      });
    } catch (err) {
      console.error("Failed to toggle progress", err);
    }
  };

  const isCompleted = (itemType: string, itemId: string) => {
    return progress.some(p => p.itemType === itemType && p.itemId === itemId && p.completed);
  };

  return (
    <ProgressContext.Provider value={{ progress, toggleProgress, isCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used within ProgressProvider");
  return context;
};
