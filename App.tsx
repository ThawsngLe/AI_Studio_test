
import React, { useState, useRef, useCallback } from 'react';
import { CanvasRef, LoadingStep, Tool } from './types';
import { DEFAULT_COLOR, DEFAULT_WIDTH } from './constants';
import { describeSketch, generateImage } from './services/geminiService';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(DEFAULT_WIDTH);
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(LoadingStep.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tool, setTool] = useState<Tool>(Tool.PEN);
  
  const canvasRef = useRef<CanvasRef>(null);

  const isLoading = loadingStep !== LoadingStep.IDLE;

  const handleCompleteSketch = useCallback(async () => {
    if (!canvasRef.current) return;

    const imageDataUrl = canvasRef.current.getCanvasDataURL();
    if (!imageDataUrl) {
      setError('Canvas trống. Hãy vẽ gì đó trước!');
      return;
    }

    setLoadingStep(LoadingStep.ANALYZING);
    setError('');
    setGeneratedImage(null);
    setAiPrompt('');

    try {
      const imageBase64 = imageDataUrl.split(',')[1];
      const description = await describeSketch(imageBase64);
      setAiPrompt(description);

      setLoadingStep(LoadingStep.GENERATING);
      const newImageBase64 = await generateImage(description);
      setGeneratedImage(`data:image/jpeg;base64,${newImageBase64}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setLoadingStep(LoadingStep.IDLE);
    }
  }, []);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
    setGeneratedImage(null);
    setError('');
    setAiPrompt('');
  };

  const handleColorChange = (color: string) => {
    setStrokeColor(color);
    if (tool !== Tool.ERASER) {
      setTool(Tool.PEN);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-screen-2xl flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-1/2 flex flex-col gap-4 p-4 md:p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="w-full flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <Canvas
                ref={canvasRef}
                tool={tool}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                backgroundColor={backgroundColor}
              />
            </div>
            <div className="flex items-center justify-center lg:h-36">
              <Toolbar
                tool={tool}
                onToolChange={setTool}
                onColorChange={handleColorChange}
                onWidthChange={setStrokeWidth}
                onBackgroundColorChange={setBackgroundColor}
                onClear={handleClear}
                onComplete={handleCompleteSketch}
                activeColor={strokeColor}
                activeWidth={strokeWidth}
                activeBackgroundColor={backgroundColor}
                isCompleting={isLoading}
              />
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-4 p-4 md:p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <ResultDisplay
              isLoading={isLoading}
              loadingStep={loadingStep}
              generatedImage={generatedImage}
              aiPrompt={aiPrompt}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
