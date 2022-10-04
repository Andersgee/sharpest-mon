import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon } from "src/icons/Moon";
import { Sun } from "src/icons/Sun";

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [darkIcon, setDarkIcon] = useState(false);

  useEffect(() => {
    if (resolvedTheme === "light") {
      setDarkIcon(false);
    } else {
      setDarkIcon(true);
    }
  }, [resolvedTheme]);

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button aria-label="Toggle theme" onClick={toggleTheme} className="hover:opacity-80">
      {darkIcon ? <Moon /> : <Sun />}
    </button>
  );
}
