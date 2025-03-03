import { Search as SearchIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/shadcnUi/input';

export const Search = ({
  className,
  value,
  onChange,
  onClear,
  ...props
}: React.ComponentProps<'input'> & { onClear?: () => void }) => {
  return (
    <div className={cn('relative w-64', className)}>
      <Input
        type="text"
        className="pl-10 pr-10"
        value={value}
        onChange={onChange}
        {...props}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
