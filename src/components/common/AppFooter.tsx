import { Logo } from './Logo';

export const AppFooter = () => {
  return (
    <footer className="h-[var(--footer-height)] w-full border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            © 2025 Все права защищены
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Создано с ❤️ для любителей учиться
        </div>
      </div>
    </footer>
  );
};
