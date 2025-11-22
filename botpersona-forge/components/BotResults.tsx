import React from 'react';
import { Terminal, FileText, User, MessageSquare, Command } from 'lucide-react';
import { GeneratedPersona } from '../types';
import { CopyButton } from './CopyButton';

interface BotResultsProps {
  persona: GeneratedPersona;
  botName: string;
}

export const BotResults: React.FC<BotResultsProps> = ({ persona, botName }) => {
  const botNamePlaceholder = `<your_bot_username>`;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* BotFather Commands Section */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-white">BotFather Configuration</h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">Manual Setup</span>
        </div>
        <div className="p-6 space-y-8">
          
          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300">1. Description (What users see first)</label>
              <CopyButton text={persona.botFatherDescription} label="Copy Text" />
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 group relative">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`/setdescription @${botNamePlaceholder} ${persona.botFatherDescription}`} label="Copy Full Command" />
                </div>
              <p className="text-green-400 font-mono text-sm mb-2 opacity-70">Run in BotFather:</p>
              <code className="text-slate-300 font-mono text-sm block mb-3">
                /setdescription
              </code>
              <div className="h-px bg-slate-800 my-3"></div>
              <p className="text-slate-400 italic text-sm">"{persona.botFatherDescription}"</p>
            </div>
          </div>

          {/* About Text */}
          <div className="space-y-2">
             <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300">2. About Text (Profile Bio)</label>
              <CopyButton text={persona.botFatherAbout} label="Copy Text" />
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 group relative">
                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={`/setabouttext @${botNamePlaceholder} ${persona.botFatherAbout}`} label="Copy Full Command" />
                </div>
              <p className="text-green-400 font-mono text-sm mb-2 opacity-70">Run in BotFather:</p>
              <code className="text-slate-300 font-mono text-sm block mb-3">
                /setabouttext
              </code>
              <div className="h-px bg-slate-800 my-3"></div>
              <p className="text-slate-400 italic text-sm">"{persona.botFatherAbout}"</p>
            </div>
          </div>

          {/* Bot Commands */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300">3. Commands (Bot Menu)</label>
              <CopyButton text={persona.botCommands} label="Copy List" />
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 group relative">
              <p className="text-green-400 font-mono text-sm mb-2 opacity-70">Run in BotFather:</p>
              <code className="text-slate-300 font-mono text-sm block mb-3">
                /setcommands
              </code>
              <div className="h-px bg-slate-800 my-3"></div>
              <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">{persona.botCommands}</pre>
            </div>
          </div>

        </div>
      </div>

      {/* System Instruction Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
         <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">AI System Instruction</h3>
          </div>
          <CopyButton text={persona.systemInstruction} label="Copy Prompt" />
        </div>
        <div className="p-6">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 max-h-60 overflow-y-auto text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {persona.systemInstruction}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Paste this into your bot backend (e.g., OpenAI system role, Gemini system_instruction).
          </p>
        </div>
      </div>

    </div>
  );
};