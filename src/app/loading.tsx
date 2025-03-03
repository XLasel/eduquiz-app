import { Loader2 } from 'lucide-react';

const blobData = [
  {
    colorClass: 'bg-blob-1',
    width: '300px',
    height: '300px',
    top: '10%',
    left: '15%',
  },
  {
    colorClass: 'bg-blob-2',
    width: '350px',
    height: '350px',
    top: '30%',
    left: '60%',
  },
  {
    colorClass: 'bg-blob-3',
    width: '250px',
    height: '250px',
    top: '50%',
    left: '25%',
  },
  {
    colorClass: 'bg-blob-4',
    width: '400px',
    height: '400px',
    top: '70%',
    left: '45%',
  },
  {
    colorClass: 'bg-blob-5',
    width: '300px',
    height: '300px',
    top: '15%',
    left: '80%',
  },
];

const Loading = () => {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-background bg-opacity-50 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {blobData.map((data, i) => (
          <div
            key={i}
            className={`animate-blob absolute rounded-full opacity-70 mix-blend-multiply blur-2xl filter dark:mix-blend-screen dark:blur-3xl ${data.colorClass}`}
            style={{
              width: data.width,
              height: data.height,
              top: data.top,
              left: data.left,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <Loader2
          className="text-clay-700 animate-spin opacity-75 dark:opacity-100"
          size={80}
        />
      </div>
    </div>
  );
};

export default Loading;
