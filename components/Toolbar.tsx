
import React from 'react';
import { STROKE_COLORS, STROKE_WIDTHS } from '../constants';
import { Tool } from '../types';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onClear: () => void;
  onComplete: () => void;
  activeColor: string;
  activeWidth: number;
  activeBackgroundColor: string;
  isCompleting: boolean;
}

// Tool Icons
const PenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const EraserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7Z"/><path d="M22 21H7"/><path d="m5 12 5 5"/></svg>;
const LineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="20" x2="20" y2="4" /></svg>;
const RectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
const CircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>;
const TriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z" /></svg>;

const ToolButton: React.FC<{ title: string; isActive: boolean; onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ title, isActive, onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`flex items-center justify-center w-10 h-10 rounded-lg text-white transition-all duration-200 ${isActive ? 'bg-blue-600 ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={title}
        aria-pressed={isActive}
    >
        {children}
    </button>
);

const ColorButton: React.FC<{ color: string; isActive: boolean; onClick: () => void; disabled: boolean }> = ({ color, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-8 h-8 rounded-full transition-transform duration-200 border-2 border-gray-800 ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'hover:scale-110'} disabled:opacity-50 disabled:cursor-not-allowed`}
    style={{ backgroundColor: color }}
    aria-label={`Chọn màu ${color}`}
  />
);

const WidthButton: React.FC<{ width: number; isActive: boolean; onClick: () => void; disabled: boolean }> = ({ width, isActive, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${isActive ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={`Chọn độ dày nét vẽ ${width}`}
    >
        <div className="bg-white rounded-full" style={{ width: `${width/1.5}px`, height: `${width/1.5}px` }}></div>
    </button>
);

const ToolbarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs text-gray-400 uppercase font-bold mb-2 text-center">{title}</h3>
    <div className="flex flex-wrap justify-center gap-2">
      {children}
    </div>
  </div>
);


const Toolbar: React.FC<ToolbarProps> = ({ tool, onToolChange, onColorChange, onWidthChange, onBackgroundColorChange, onClear, onComplete, activeColor, activeWidth, activeBackgroundColor, isCompleting }) => {
  const isCustomColorActive = !STROKE_COLORS.includes(activeColor);
  
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6">
      <div className="flex flex-wrap items-start justify-center lg:justify-start gap-x-6 gap-y-4">
        <ToolbarSection title="Công cụ">
          <ToolButton title="Bút vẽ" isActive={tool === Tool.PEN} onClick={() => onToolChange(Tool.PEN)} disabled={isCompleting}><PenIcon /></ToolButton>
          <ToolButton title="Cục tẩy" isActive={tool === Tool.ERASER} onClick={() => onToolChange(Tool.ERASER)} disabled={isCompleting}><EraserIcon /></ToolButton>
          <div className="w-full h-px bg-gray-700 my-1 lg:hidden"></div>
          <ToolButton title="Đường thẳng" isActive={tool === Tool.LINE} onClick={() => onToolChange(Tool.LINE)} disabled={isCompleting}><LineIcon /></ToolButton>
          <ToolButton title="Hình chữ nhật" isActive={tool === Tool.RECTANGLE} onClick={() => onToolChange(Tool.RECTANGLE)} disabled={isCompleting}><RectangleIcon /></ToolButton>
          <ToolButton title="Hình tròn" isActive={tool === Tool.CIRCLE} onClick={() => onToolChange(Tool.CIRCLE)} disabled={isCompleting}><CircleIcon /></ToolButton>
          <ToolButton title="Hình tam giác" isActive={tool === Tool.TRIANGLE} onClick={() => onToolChange(Tool.TRIANGLE)} disabled={isCompleting}><TriangleIcon /></ToolButton>
        </ToolbarSection>
        
        <ToolbarSection title="Màu nét">
          {STROKE_COLORS.map(color => (
            <ColorButton key={color} color={color} isActive={activeColor === color && tool !== Tool.ERASER} onClick={() => onColorChange(color)} disabled={isCompleting}/>
          ))}
          <div
            className={`relative w-8 h-8 rounded-full transition-all duration-200 border-2 border-gray-800 ${isCustomColorActive && tool !== Tool.ERASER ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'hover:scale-110'} ${isCompleting ? 'opacity-50' : ''}`}
            style={{
              backgroundImage: isCustomColorActive ? 'none' : 'conic-gradient(from 180deg at 50% 50%, #EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #A855F7, #EF4444)',
              backgroundColor: isCustomColorActive ? activeColor : 'transparent',
            }}
            title="Chọn màu tùy chỉnh"
          >
            <input
              type="color"
              value={activeColor}
              onChange={(e) => onColorChange(e.target.value)}
              disabled={isCompleting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Công cụ chọn màu tùy chỉnh"
            />
          </div>
        </ToolbarSection>

        <ToolbarSection title="Nét vẽ">
          {STROKE_WIDTHS.map(width => (
              <WidthButton key={width} width={width} isActive={activeWidth === width} onClick={() => onWidthChange(width)} disabled={isCompleting}/>
          ))}
        </ToolbarSection>
        
        <ToolbarSection title="Màu nền">
           <div
            className="relative w-8 h-8 rounded-full transition-all duration-200 border-2 border-dashed border-gray-500 hover:border-gray-400"
            title="Chọn màu nền"
          >
            <div 
              className="w-full h-full rounded-full"
              style={{ backgroundColor: activeBackgroundColor }}
            />
            <input
              type="color"
              value={activeBackgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              disabled={isCompleting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Công cụ chọn màu nền"
            />
          </div>
        </ToolbarSection>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onClear}
            disabled={isCompleting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xóa
          </button>
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
          >
            {isCompleting ? 'Đang xử lý...' : 'Hoàn Thiện'}
          </button>
        </div>
    </div>
  );
};

export default Toolbar;
