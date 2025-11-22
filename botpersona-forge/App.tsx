import React, { useState } from 'react';
import { MessageCircle, Info } from 'lucide-react';
import { PersonaGenerator } from './components/PersonaGenerator';
import { BotResults } from './components/BotResults';
import { ChatPreview } from './components/ChatPreview';
import { DeploymentGuide } from './components/DeploymentGuide';
import { generatePersonaData } from './services/geminiService';
import { GeneratedPersona, PersonaFormData } from './types';

const App: React.FC = () => {
  const [persona, setPersona] = useState<GeneratedPersona | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBotName, setCurrentBotName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: PersonaFormData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePersonaData(data.name, data.vibe, data.purpose);
      setPersona(result);
      setCurrentBotName(data.name);
    } catch (err) {
      console.error(err);
      setError("Failed to generate persona. Please ensure API Key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">BotPersona <span className="text-blue-500">Forge</span></h1>
          </div>
          <a 
            href="https://core.telegram.org/bots#6-botfather" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>BotFather Guide</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Craft Your Telegram Bot's Soul
          </h2>
          <p className="text-lg text-slate-400">
            Instantly generate the personalities, commands, and system prompts needed to bring your AI bot to life.
            Set your character with <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">BotFather</code> commands in seconds.
          </p>
        </div>

        {/* Generator Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <PersonaGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && (
             <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
             </div>
          )}
        </div>

        {/* Results Section */}
        {persona && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left Column: Configuration Details */}
            <div className="lg:col-span-7 space-y-8">
               <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-white">1. Configuration</h3>
                  <div className="h-px flex-1 bg-slate-800"></div>
               </div>
               <BotResults persona={persona} botName={currentBotName} />

               {/* Deployment Guide */}
               <DeploymentGuide persona={persona} />
            </div>

            {/* Right Column: Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                 <div className="flex items-center space-x-2 mb-6">
                    <h3 className="text-xl font-bold text-white">2. Test Drive</h3>
                    <div className="h-px flex-1 bg-slate-800"></div>
                 </div>
                <ChatPreview persona={persona} botName={currentBotName} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
