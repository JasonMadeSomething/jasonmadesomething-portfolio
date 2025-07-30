"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state to true when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // First try to get from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setTheme(savedTheme);
    } else {
      // If no valid theme in localStorage, use system preference or default to dark
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      localStorage.setItem("theme", prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // Update HTML class when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Force a direct DOM update to ensure theme changes apply
    const applyTheme = () => {
      const root = document.documentElement;
      const body = document.body;
      
      // First remove all theme classes
      root.classList.remove("dark", "light");
      body.classList.remove("dark-theme", "light-theme");
      
      // Then add the appropriate classes
      if (theme === "dark") {
        root.classList.add("dark");
        body.classList.add("dark-theme");
        document.documentElement.style.colorScheme = "dark";
        // Force meta color-scheme for browsers that respect it
        updateMetaColorScheme("dark");
      } else {
        root.classList.add("light");
        body.classList.add("light-theme");
        document.documentElement.style.colorScheme = "light";
        // Force meta color-scheme for browsers that respect it
        updateMetaColorScheme("light");
      }
      
      // Save to localStorage
      localStorage.setItem("theme", theme);
      console.log("Theme applied:", theme, "Classes on html:", root.className);
    };
    
    // Helper function to update meta color-scheme
    const updateMetaColorScheme = (scheme: string) => {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'color-scheme');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', scheme);
    };
    
    // Apply immediately
    applyTheme();
    
    // Also apply after a short delay to ensure it takes effect
    const timeoutId = setTimeout(applyTheme, 50);
    
    // Apply again after a longer delay to handle potential browser inconsistencies
    const longTimeoutId = setTimeout(applyTheme, 500);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(longTimeoutId);
    };
  }, [theme, mounted]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      console.log("Toggling theme from", prevTheme, "to", newTheme);
      return newTheme;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
