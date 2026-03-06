import { useState, useRef, useCallback } from 'react';

interface Props {
  onSubmit: (files: File[]) => void;
}

const MAX_FILES = 4;
const MIN_FILES = 2;
const MAX_SIZE_MB = 5;

export default function PhotoUpload({ onSubmit }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const incoming = Array.from(newFiles).filter((f) =>
        ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'].includes(
          f.type
        ) || f.name.toLowerCase().endsWith('.heic')
      );

      const remaining = MAX_FILES - files.length;
      const toAdd = incoming.slice(0, remaining);

      const updated = [...files, ...toAdd];
      setFiles(updated);

      toAdd.forEach((f) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(f);
      });
    },
    [files]
  );

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  const oversized = files.some((f) => f.size > MAX_SIZE_MB * 1024 * 1024);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Zrob zdjecia urzadzenia
        </h2>
        <p className="mt-1 text-sm text-xkom-muted">
          Dodaj 2-4 zdjecia (przod, tyl, boki, ekran z bliska). Im wiecej
          zdjec, tym dokladniejsza wycena.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? 'border-xkom-green bg-xkom-green/10'
            : 'border-xkom-accent/50 hover:border-xkom-green/50 hover:bg-xkom-card/50'
        } ${files.length >= MAX_FILES ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <svg
          className="mb-3 h-10 w-10 text-xkom-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
          />
        </svg>
        <span className="text-sm text-xkom-muted">
          {files.length >= MAX_FILES
            ? 'Maksymalna liczba zdjec'
            : 'Przeciagnij zdjecia lub kliknij, aby wybrac'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Capture button for mobile */}
      {files.length < MAX_FILES && (
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) addFiles(target.files);
            };
            input.click();
          }}
          className="w-full rounded-lg border border-xkom-accent/50 px-4 py-3 text-sm text-xkom-muted hover:border-xkom-green/50 hover:text-white transition-colors"
        >
          Zrob zdjecie aparatem
        </button>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((src, i) => (
            <div key={i} className="group relative">
              <img
                src={src}
                alt={`Zdjecie ${i + 1}`}
                className="h-32 w-full rounded-lg object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-xkom-red text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                X
              </button>
              {files[i] && files[i].size > MAX_SIZE_MB * 1024 * 1024 && (
                <span className="absolute bottom-1 left-1 rounded bg-xkom-yellow/90 px-1 text-[10px] text-black">
                  Zostanie skompresowane
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {oversized && (
        <p className="text-xs text-xkom-yellow">
          Niektore zdjecia sa wieksze niz {MAX_SIZE_MB}MB — zostana
          automatycznie skompresowane.
        </p>
      )}

      <button
        disabled={files.length < MIN_FILES}
        onClick={() => onSubmit(files)}
        className={`w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
          files.length >= MIN_FILES
            ? 'bg-xkom-green text-white hover:bg-xkom-green/90'
            : 'bg-xkom-accent/30 text-xkom-muted cursor-not-allowed'
        }`}
      >
        Analizuj urzadzenie ({files.length}/{MIN_FILES}-{MAX_FILES} zdjec)
      </button>
    </div>
  );
}
