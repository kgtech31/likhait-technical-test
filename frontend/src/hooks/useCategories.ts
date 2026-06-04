import { useState, useEffect, useCallback } from "react";
import { fetchCategories, createCategory as apiCreateCategory } from "../services/api";

export interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const createCategory = async (name: string) => {
    try {
      const newCategory = await apiCreateCategory(name);
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      return newCategory;
    } catch (err) {
      throw err;
    }
  };

  return {
    categories,
    isLoading,
    error,
    createCategory,
    refreshCategories: loadCategories
  };
}
