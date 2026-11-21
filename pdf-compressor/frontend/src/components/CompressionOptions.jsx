import React from 'react';
import { Check, Sparkles, Feather, Flame } from 'lucide-react';

const COMPRESSION_LEVELS = [
  {
    id: 'low',
    name: 'Low Compression',
    tag: 'Highest Quality',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Feather,
    iconBg: 'bg-emerald-100 text-emerald-600',
    reduction: '~20% - 40%',
    description: 'Slightly reduce file size while preserving maximum visual quality, vector details, and high-resolution images.',
    bestFor: 'Design portfolios, documents for print, and detailed blueprints.'
  },
  {
    id: 'recommended',
    name: 'Recommended Compression',
    tag: 'Default & Popular',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Sparkles,
    iconBg: 'bg-indigo-100 text-indigo-600',
    reduction: '~50% - 70%',
    description: 'Optimal balance between substantial file size reduction and pristine document readability and crispness.',
    bestFor: 'Office reports, forms, resumes, presentations, and daily sharing.'
  },
  {
    id: 'high',
    name: 'High Compression',
    tag: 'Smallest File',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Flame,
    iconBg: 'bg-purple-100 text-purple-600',
    reduction: '~70% - 85%',
    description: 'Prioritize maximum size reduction. Aggressively optimizes embedded graphics and strips non-essential metadata.',
    bestFor: 'Strict email attachment limits, slow networks, and cloud archiving.'
  }
];

export default function CompressionOptions({ selectedLevel, onSelectLevel, disabled = false }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="text-lg font-bold text-slate-800">
          Select Compression Level
        </h3>
        <span className="text-xs text-slate-500">
          Choose how aggressively to optimize your PDF
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COMPRESSION_LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;
          const Icon = level.icon;

          return (
            <div
              key={level.id}
              onClick={() => !disabled && onSelectLevel(level.id)}
              className={`relative rounded-2xl p-5 border-2 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                disabled ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-md shadow-indigo-600/10 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
              }`}
            >
              {/* Header with icon and radio indicator */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${level.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Level Title & Tag */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{level.name}</h4>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${level.tagColor}`}>
                    {level.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Reduction estimate & best for */}
              <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-400">Est. Reduction:</span>
                  <span className="font-semibold text-indigo-700">{level.reduction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
