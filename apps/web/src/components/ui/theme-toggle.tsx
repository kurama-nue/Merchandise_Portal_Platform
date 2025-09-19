import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      root.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      root.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    root.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`rounded-full p-2 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <div className="relative h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
        <motion.div
          className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-md"
          animate={{ x: theme === "dark" ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <Sun className="absolute top-0.5 left-0.5 h-5 w-5 text-yellow-500 opacity-100 dark:opacity-0 transition-opacity" />
        <Moon className="absolute top-0.5 right-0.5 h-5 w-5 text-blue-500 opacity-0 dark:opacity-100 transition-opacity" />
      </div>
    </motion.button>
  );
}