import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ToolCard({ title, description, route, buttonText, icon: Icon, badge, colorClass }) {
  return (
    <Link
      to={route}
      className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Subtle Ambient Glow on Hover */}
      <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-indigo-50/70 group-hover:scale-150 transition-transform duration-300 pointer-events-none" />

      <div>
        {/* Top Icon & Badge Row */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-200 ${
              colorClass || 'bg-indigo-50 text-indigo-600 shadow-indigo-100'
            }`}
          >
            {Icon && <Icon className="w-7 h-7 stroke-[2]" />}
          </div>

          {badge && (
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button Link */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
        <span>{buttonText || 'Open Tool'}</span>
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
