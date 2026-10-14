import React from 'react';

interface MascotOwlProps {
  mood?: 'happy' | 'waving' | 'thinking' | 'worried' | 'graduate';
  className?: string;
  speechText?: string;
}

export const MascotOwl: React.FC<MascotOwlProps> = ({
  mood = 'happy',
  className = 'w-24 h-24',
  speechText,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative shrink-0 ${className} transition-transform duration-300 hover:scale-105 select-none`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="60" cy="112" rx="36" ry="6" fill="#CBD5E1" opacity="0.6" />

          {/* Feet */}
          <path d="M46 106 C44 112 40 114 36 112" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 106 C50 112 48 114 44 113" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <path d="M74 106 C76 112 80 114 84 112" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 106 C70 112 72 114 76 113" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

          {/* Body */}
          <ellipse cx="60" cy="68" rx="42" ry="44" fill="#10B981" />
          {/* Belly */}
          <ellipse cx="60" cy="74" rx="28" ry="30" fill="#ECFDF5" />

          {/* Feathers pattern on belly */}
          <path d="M54 70 Q60 74 66 70" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 82 Q60 88 72 82" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 92 Q60 96 68 92" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />

          {/* Wings */}
          {mood === 'waving' ? (
            <>
              {/* Left wing waving high */}
              <path d="M22 65 C12 50 10 32 20 28 C26 26 32 38 30 55 Z" fill="#059669" className="animate-bounce" />
              <path d="M98 65 C108 72 106 88 94 92 Z" fill="#059669" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Wing on chin */}
              <path d="M22 65 C14 72 16 88 28 92 Z" fill="#059669" />
              <path d="M98 65 C96 52 82 54 74 62 C78 68 88 72 96 68 Z" fill="#059669" />
            </>
          ) : (
            <>
              {/* Normal Wings */}
              <path d="M22 65 C14 72 16 88 28 92 Z" fill="#059669" />
              <path d="M98 65 C106 72 104 88 92 92 Z" fill="#059669" />
            </>
          )}

          {/* Ear Tufts */}
          <path d="M30 36 L24 16 L44 26 Z" fill="#047857" />
          <path d="M90 36 L96 16 L76 26 Z" fill="#047857" />

          {/* Eyes Base (Spectacles Bridge) */}
          <line x1="48" y1="50" x2="72" y2="50" stroke="#1E293B" strokeWidth="3" />

          {/* Left Eye & Glasses */}
          <circle cx="44" cy="50" r="16" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3.5" />
          {/* Right Eye & Glasses */}
          <circle cx="76" cy="50" r="16" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3.5" />

          {/* Eye Pupils based on Mood */}
          {mood === 'worried' ? (
            <>
              <circle cx="44" cy="48" r="6" fill="#1E293B" />
              <circle cx="76" cy="48" r="6" fill="#1E293B" />
              <path d="M36 34 Q44 40 52 38" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M68 38 Q76 40 84 34" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              <circle cx="46" cy="45" r="6.5" fill="#1E293B" />
              <circle cx="78" cy="45" r="6.5" fill="#1E293B" />
              <circle cx="48" cy="43" r="2" fill="#FFFFFF" />
              <circle cx="80" cy="43" r="2" fill="#FFFFFF" />
              {/* Question mark above head */}
              <text x="88" y="24" fontSize="18" fontWeight="bold" fill="#F59E0B" fontFamily="sans-serif">?</text>
            </>
          ) : (
            <>
              <circle cx="46" cy="50" r="7" fill="#1E293B" />
              <circle cx="74" cy="50" r="7" fill="#1E293B" />
              {/* Highlights */}
              <circle cx="48" cy="48" r="2.5" fill="#FFFFFF" />
              <circle cx="76" cy="48" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Beak */}
          <polygon points="60,56 53,67 67,67" fill="#F59E0B" />
          <polygon points="60,69 55,67 65,67" fill="#D97706" />

          {/* Graduation Cap if graduate */}
          {mood === 'graduate' && (
            <g>
              <polygon points="60,10 100,24 60,34 20,24" fill="#0F172A" />
              <rect x="44" y="27" width="32" height="10" rx="3" fill="#1E293B" />
              {/* Tassel */}
              <path d="M60 22 C78 22 84 32 86 42" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
              <circle cx="86" cy="43" r="3" fill="#F59E0B" />
            </g>
          )}
        </svg>
      </div>

      {speechText && (
        <div className="relative bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-700 shadow-sm max-w-xs md:max-w-md leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
          <span className="font-semibold text-emerald-800 mr-1.5">Logi:</span>
          {speechText}
        </div>
      )}
    </div>
  );
};
