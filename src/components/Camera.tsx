import React, { useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, RefreshCw, CameraOff } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CameraProps {
  onCapture: (base64: string) => void;
  className?: string;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setError(null);
    try {
      // Try with environment facing mode first (preferred for mobile)
      const constraints = {
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permission denied. Please enable camera access in your browser settings and refresh.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Could not access camera. Please check your device settings.');
      }
    }
  };


  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  }, [onCapture]);

  return (
    <div className={cn("relative bg-black rounded-2xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center", className)}>
      {!isActive ? (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          {error ? (
            <CameraOff className="w-12 h-12 text-red-500" />
          ) : (
            <CameraIcon className="w-12 h-12 text-zinc-500" />
          )}
          <p className="text-zinc-400 text-sm">
            {error || "Ready to scan for defects"}
          </p>
          <button
            onClick={startCamera}
            className="px-6 py-2 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-white transition-colors"
          >
            Start Camera
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6">
            <button
              onClick={stopCamera}
              className="p-4 bg-zinc-900/80 backdrop-blur-md text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            <button
              onClick={capture}
              className="p-6 bg-white text-black rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95"
            >
              <CameraIcon className="w-8 h-8" />
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
