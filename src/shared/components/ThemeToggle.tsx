import { useTheme } from "../../hooks/usetheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 transition"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
