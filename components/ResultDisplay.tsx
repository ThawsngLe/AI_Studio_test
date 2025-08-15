
import React from 'react';
import { LoadingStep } from '../types';

interface ResultDisplayProps {
  isLoading: boolean;
  loadingStep: LoadingStep;
  generatedImage: string | null;
  aiPrompt: string;
  error: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
);

const SkeletonLoader: React.FC = () => (
  <div className="w-full h-full bg-gray-700 rounded-lg overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-600/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
  </div>
);

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, loadingStep, generatedImage, aiPrompt, error }) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-masterpiece.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full flex-1 rounded-xl bg-gray-900/50 border border-gray-700/80 flex items-center justify-center overflow-hidden relative group">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center w-full h-full">
            <SkeletonLoader/>
          </div>
        )}
        {!isLoading && error && (
          <div className="text-center text-red-400 p-4">
            <h3 className="text-lg font-bold">Ôi không!</h3>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && generatedImage && (
          <>
            <img src={generatedImage} alt="AI generated" className="w-full h-full object-contain" />
            <button
              onClick={handleDownload}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300"
              title="Tải xuống hình ảnh"
              aria-label="Tải xuống hình ảnh"
            >
              <DownloadIcon />
            </button>
          </>
        )}
        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-400 p-4">
            <h3 className="text-xl font-semibold">Đang chờ tác phẩm</h3>
            <p>Hình ảnh được tạo sẽ xuất hiện ở đây.</p>
          </div>
        )}
      </div>
      <div className="text-center w-full flex flex-col justify-center lg:h-36">
        {isLoading && (
             <div className="flex flex-col items-center justify-center gap-2">
                <LoadingSpinner/>
                <p className="text-blue-300 font-medium animate-pulse">{loadingStep}</p>
             </div>
        )}
        {!isLoading && !error && aiPrompt && (
          <div className="bg-gray-800 p-3 rounded-lg h-full flex flex-col justify-center">
            <p className="text-sm text-gray-400">Gợi ý của AI:</p>
            <p className="text-md text-gray-200 italic">"{aiPrompt}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
