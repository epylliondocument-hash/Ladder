import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, X, Check } from 'lucide-react';

interface StylePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string | null;
  caption: string;
  onSavePhoto: (dataUrl: string | null, caption: string) => void;
}

export const StylePhotoModal: React.FC<StylePhotoModalProps> = ({
  isOpen,
  onClose,
  photoUrl,
  caption,
  onSavePhoto,
}) => {
  const [currentPhoto, setCurrentPhoto] = React.useState<string | null>(photoUrl);
  const [currentCaption, setCurrentCaption] = React.useState(caption);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setCurrentPhoto(photoUrl);
    setCurrentCaption(caption);
  }, [photoUrl, caption, isOpen]);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Resize for mobile optimization and localStorage durability
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setCurrentPhoto(compressed);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDone = () => {
    onSavePhoto(currentPhoto, currentCaption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Android Drawer Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-base">Garment Style Picture</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Photo Preview Container */}
          <div className="relative w-full aspect-video rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center group">
            {currentPhoto ? (
              <>
                <img
                  src={currentPhoto}
                  alt="Garment preview"
                  className="w-full h-full object-contain bg-white/5"
                />
                <button
                  onClick={() => setCurrentPhoto(null)}
                  type="button"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 shadow-md"
                  title="Remove picture"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-300">No picture attached</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Take photo with camera or upload from gallery
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons for Mobile Camera & File */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleProcessFile(e.target.files[0]);
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleProcessFile(e.target.files[0]);
              }}
            />

            <button
              onClick={() => cameraInputRef.current?.click()}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-md transition"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery / Files</span>
            </button>
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
              Caption / Style Ref (Appears in PDF)
            </label>
            <input
              type="text"
              value={currentCaption}
              onChange={(e) => setCurrentCaption(e.target.value)}
              placeholder="e.g. Style #JK-402 · H&M Outerwear · Fall Order"
              maxLength={100}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
