import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="bg-[#766351] rounded-t-lg px-6 py-3">
          <div className="flex items-center">
            <div className="w-8" aria-hidden></div>
            <h2 className="flex-1 text-center text-white text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-white ml-2 p-1 rounded hover:bg-white/10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-gray-50 p-6 rounded-b-lg">
          {children}
        </div>
      </div>
    </div>
  );
}