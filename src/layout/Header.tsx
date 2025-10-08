import { Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useThemeStore } from '../store/themeStore';

export function Header() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Добро пожаловать</h2>
          <p className="text-sm text-muted-foreground">
            Управление дефектами строительных объектов
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
