import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, BookOpen, Layers, GitBranch, Cpu, Binary, Compass, Sparkles } from 'lucide-react';
import { TopicId, UOC_TOPICS, UocTopic } from '../data/topics';
import { sound } from '../utils/audio';

interface TopicSelectorProps {
  selectedTopicId: TopicId;
  onSelectTopic: (topicId: TopicId) => void;
}

const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'file-text':
      return <BookOpen className="w-4 h-4 text-blue-500" />;
    case 'git-branch':
      return <GitBranch className="w-4 h-4 text-emerald-500" />;
    case 'cpu':
      return <Cpu className="w-4 h-4 text-purple-500" />;
    case 'binary':
      return <Binary className="w-4 h-4 text-amber-500" />;
    case 'compass':
      return <Compass className="w-4 h-4 text-rose-500" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4 text-cyan-500" />;
    default:
      return <Layers className="w-4 h-4 text-slate-500" />;
  }
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopicId,
  onSelectTopic,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTopic = UOC_TOPICS.find((t) => t.id === selectedTopicId) || UOC_TOPICS[1];

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-30 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs transition-colors">
        {/* Left: Current Active Topic Label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
            {getTopicIcon(currentTopic.iconName)}
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentTopic.code}
              </span>
              <span>·</span>
              <span>{currentTopic.semesterInfo}</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
              {currentTopic.fullName}
            </h3>
          </div>
        </div>

        {/* Right: Dropdown Trigger Button */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsOpen(!isOpen);
            }}
            className="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors flex items-center justify-between sm:justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
            aria-expanded={isOpen}
          >
            <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/50 dark:border-emerald-700/50">
              {currentTopic.code}
            </span>
            <span>Cambiar Tema</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                Temario Oficial Lógica UOC (Ingeniería Informática)
              </div>
              <div className="space-y-1 max-h-[380px] overflow-y-auto">
                {UOC_TOPICS.map((topic) => {
                  const isSelected = topic.id === selectedTopicId;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectTopic(topic.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {getTopicIcon(topic.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {topic.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                              · {topic.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {topic.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1 stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
