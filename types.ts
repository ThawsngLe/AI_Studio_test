
export interface CanvasRef {
  clearCanvas: () => void;
  getCanvasDataURL: () => string;
}

export enum LoadingStep {
  IDLE = 'IDLE',
  ANALYZING = 'Đang phân tích bản phác thảo...',
  GENERATING = 'Đang tạo hình ảnh...',
}

export enum Tool {
  PEN = 'PEN',
  ERASER = 'ERASER',
  LINE = 'LINE',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  TRIANGLE = 'TRIANGLE',
}
