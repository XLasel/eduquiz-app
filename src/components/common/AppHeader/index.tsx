'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Menu } from 'lucide-react';

import { Button } from '@/components/shadcnUi/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/shadcnUi/sheet';
import { ToggleTheme } from '@/components/shadcnUi/toggleTheme';

import { APP_ROUTES } from '@/constants';
import { useDeviceInfo, useToast } from '@/hooks';

import { Logo } from '../Logo';
import { MainNav } from './MainNav';
import { UserActionButtons } from './UserActionButtons';

export const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDeviceInfo();
  const { toast } = useToast();
  const router = useRouter();

  const handleLinkClick = async (href: string) => {
    try {
      await router.push(href);
    } catch {
      toast({
        title: 'Ошибка',
        description:
          'Произошла ошибка при переходе. Перенаправляем вас на главную страницу.',
      });

      router.push(APP_ROUTES.HOME);
    } finally {
      setIsOpen(false);
    }
  };

  const renderDesktopNav = () => (
    <div className="hidden md:flex md:grow md:items-center md:justify-between">
      <MainNav />
      <div className="flex items-center justify-between gap-3">
        <UserActionButtons />
        <ToggleTheme />
      </div>
    </div>
  );

  const renderMobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex h-full flex-col gap-6">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <MainNav onLinkClick={handleLinkClick} />
          <div className="mt-auto flex justify-end gap-3">
            <UserActionButtons onClick={handleLinkClick} />
            <ToggleTheme />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-40 h-[var(--header-height)] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-full items-center justify-between gap-5 p-4">
        <Logo />
        {!isMobile && renderDesktopNav()}
        {isMobile && renderMobileNav()}
      </div>
    </header>
  );
};
