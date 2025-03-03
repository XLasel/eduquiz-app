import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="flex flex-1 items-center justify-center">
    <Loader2
      className="text-clay-700 animate-spin opacity-75 dark:opacity-100"
      size={80}
    />
  </div>
);

export default Loading;
