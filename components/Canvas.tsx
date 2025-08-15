
import React, { useRef, useEffect, useImperativeHandle, useState, useCallback } from 'react';
import { CanvasRef, Tool } from '../types';

interface CanvasProps {
  tool: Tool;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
}

const Canvas = React.forwardRef<CanvasRef, CanvasProps>(({ tool, strokeColor, strokeWidth, backgroundColor }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number; y: number} | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  const setCanvasBackground = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [backgroundColor]);
  
  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      
      if (canvas.width !== width || canvas.height !== height) {
        const context = canvas.getContext('2d');
        if (context) {
            const imageData = (canvas.width > 0 && canvas.height > 0) 
              ? context.getImageData(0, 0, canvas.width, canvas.height)
              : null;
            
            canvas.width = width;
            canvas.height = height;
            
            setCanvasBackground();
            
            if (imageData) context.putImageData(imageData, 0, 0);

            context.lineCap = 'round';
            context.lineJoin = 'round';
        }
      }
    }
  }, [setCanvasBackground]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    contextRef.current = canvas.getContext('2d');
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, [setCanvasSize]);

  useEffect(() => {
    setHasDrawing(false); // Changing background color clears drawing
    setCanvasBackground();
  }, [backgroundColor, setCanvasBackground]);

  useEffect(() => {
    const context = contextRef.current;
    if (context) {
      context.strokeStyle = tool === Tool.ERASER ? backgroundColor : strokeColor;
      context.lineWidth = strokeWidth;
      context.globalCompositeOperation = 'source-over';
    }
  }, [tool, strokeColor, strokeWidth, backgroundColor]);

  const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const drawShape = useCallback((endPoint: {x: number, y: number}) => {
    const context = contextRef.current;
    if (!context || !startPoint) return;

    context.beginPath();
    switch (tool) {
      case Tool.LINE:
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        break;
      case Tool.RECTANGLE:
        context.rect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        break;
      case Tool.CIRCLE:
        const radius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
        context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        break;
      case Tool.TRIANGLE:
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.lineTo(startPoint.x * 2 - endPoint.x, endPoint.y);
        context.closePath();
        break;
    }
    context.stroke();
  }, [tool, startPoint]);
  
  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const context = contextRef.current;
    const coords = getCoords(e);
    if (!coords || !context) return;
    
    setIsDrawing(true);
    setHasDrawing(true);
    setStartPoint(coords);

    if (tool === Tool.PEN || tool === Tool.ERASER) {
      context.beginPath();
      context.moveTo(coords.x, coords.y);
    } else {
      setSnapshot(context.getImageData(0, 0, context.canvas.width, context.canvas.height));
    }
  }, [tool]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const context = contextRef.current;
    const coords = getCoords(e);
    if (!coords || !context) return;

    if (tool === Tool.PEN || tool === Tool.ERASER) {
      context.lineTo(coords.x, coords.y);
      context.stroke();
    } else if (snapshot) {
      context.putImageData(snapshot, 0, 0);
      drawShape(coords);
    }
  }, [isDrawing, tool, snapshot, drawShape]);

  const stopDrawing = useCallback(() => {
    const context = contextRef.current;
    if (!isDrawing || !context) return;
    
    context.closePath();
    setIsDrawing(false);
    
    // Clear snapshot for shapes
    setStartPoint(null);
    setSnapshot(null);
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground();
        setHasDrawing(false);
      }
    },
    getCanvasDataURL: () => {
      if (!hasDrawing) return "";
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : '';
    },
  }), [backgroundColor, hasDrawing, setCanvasBackground]);

  return <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />;
});

Canvas.displayName = 'Canvas';
export default Canvas;
