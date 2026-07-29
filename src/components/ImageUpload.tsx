import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label, placeholder = "Upload local file" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // We will resize the image to prevent LocalStorage QuotaExceededError
        const maxDimension = 900; // max width or height
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to a compressed JPEG format to keep base64 string small
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          onChange(compressedDataUrl);
        } else {
          // Fallback if canvas context fails
          onChange(event.target?.result as string);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        setError('Failed to load image.');
        setIsProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  // Check if image is a base64 string
  const isBase64 = value ? value.startsWith('data:image/') : false;

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-[8px] font-mono-tag text-zinc-500 uppercase tracking-widest">
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`group/dropzone relative border rounded flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 min-h-[90px] ${
          isDragActive
            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300'
            : 'border-dashed border-white/10 hover:border-white/20 bg-zinc-950/40 hover:bg-zinc-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-2 py-1">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="text-[9px] font-mono-tag text-zinc-400 uppercase tracking-wider">
              Processing & Compressing...
            </span>
          </div>
        ) : value ? (
          <div className="relative w-full h-16 flex items-center justify-between gap-3 bg-zinc-900/50 p-2 rounded border border-white/5 group-hover/dropzone:border-white/10 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-12 h-12 rounded overflow-hidden bg-black/60 flex-shrink-0 border border-white/10">
                <img
                  src={value}
                  alt="Pre-view"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left overflow-hidden">
                <span className="block text-[9px] font-mono-tag text-cyan-400 font-semibold tracking-wider uppercase mb-0.5">
                  {isBase64 ? 'Local Image Loaded' : 'Web Image Link'}
                </span>
                <span className="block text-[8px] font-mono text-zinc-400 truncate max-w-[150px] sm:max-w-[200px]">
                  {isBase64 ? 'Stored locally in browser data' : value}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={clearImage}
              className="p-1 rounded bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 border border-white/5 transition flex-shrink-0"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="w-8 h-8 rounded-full border border-dashed border-white/10 flex items-center justify-center text-zinc-500 mb-2 group-hover/dropzone:scale-105 group-hover/dropzone:border-cyan-400/30 group-hover/dropzone:text-cyan-400 transition-all duration-300">
              <Upload size={14} />
            </div>
            <p className="font-mono-tag text-[9px] tracking-widest text-zinc-400 uppercase group-hover/dropzone:text-slate-200 transition-colors">
              {placeholder}
            </p>
            <p className="text-[8px] text-zinc-600 mt-1 uppercase tracking-wider">
              Drag & Drop file or click to select
            </p>
          </div>
        )}

        {error && (
          <div className="absolute bottom-1 left-2 right-2 text-center">
            <span className="text-[8px] font-mono text-rose-400 font-medium bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/20">
              {error}
            </span>
          </div>
        )}
      </div>

      {!isProcessing && !value && (
        <p className="text-[8px] text-zinc-500 leading-normal pl-1">
          Tip: You can upload local JPG/PNG files directly; they will be resized for optimal page speed.
        </p>
      )}
    </div>
  );
}
