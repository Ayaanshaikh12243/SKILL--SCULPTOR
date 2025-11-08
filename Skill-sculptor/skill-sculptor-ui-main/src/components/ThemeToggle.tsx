import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0 border-0 bg-transparent hover:bg-muted/50 transition-colors duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
