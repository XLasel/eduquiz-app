import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcnUi/select';

type ItemsPerPageButtonProps = {
  options?: number[];
  selected: number;
  onChange: (itemsPerPage: number) => void;
};

export const ItemsPerPageButton = ({
  options = [5, 10, 15],
  selected,
  onChange,
}: ItemsPerPageButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="items-per-page"
        className="sr-only flex items-center text-sm font-medium text-muted-foreground dark:text-zinc-200 sm:not-sr-only"
      >
        Тестов на странице
      </label>
      <Select
        value={selected.toString()}
        onValueChange={(newValue: string) => onChange(parseInt(newValue, 10))}
      >
        <SelectTrigger id="items-per-page" className="w-[66px]">
          <SelectValue placeholder="Выберите" />
        </SelectTrigger>
        <SelectContent className="min-w-[66px]">
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
