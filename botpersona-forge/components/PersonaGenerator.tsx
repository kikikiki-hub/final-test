import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PersonaFormData } from '../types';

interface PersonaGeneratorProps {
  onGenerate: (data: PersonaFormData) => Promise<void>;
  isGenerating: boolean;
}

export const PersonaGenerator: React.FC<PersonaGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    vibe: '',
    purpose: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.vibe && formData.purpose) {
      onGenerate(formData);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Define Your Bot</h2>
          <p className="text-slate-400 text-sm">Describe the character you want to create.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Bot Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Captain Hook, Dr. Helpful"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Vibe / Tone</label>
            <input
              type="text"
              value={formData.vibe}
              onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
              placeholder="e.g., Sarcastic, Professional, Pirate"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Purpose</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="e.g., Customer Support, Weather Updates"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isGenerating}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !formData.name || !formData.vibe || !formData.purpose}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Forging Persona...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Persona</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
