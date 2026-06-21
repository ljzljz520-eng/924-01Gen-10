import { BookOpen, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import type { AppMode } from '@/types';

export function ModeSwitcher() {
  const currentMode = useAppStore((s) => s.currentMode);
  const setMode = useAppStore((s) => s.setMode);
  const scriptName = useAppStore((s) => s.script.name);
  const setScriptName = useAppStore((s) => s.setScriptName);

  const modes: { id: AppMode; label: string; icon: typeof BookOpen }[] = [
    { id: 'creator', label: '作者模式', icon: BookOpen },
    { id: 'host', label: '主持人模式', icon: Users },
  ];

  return (
    <header className="no-print bg-ink-900/95 backdrop-blur-sm border-b border-amber-warm/20 px-6 py-3">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
              className="bg-transparent border-none outline-none text-parchment-100 font-serif text-xl font-bold
                         focus:border-b focus:border-amber-warm/50 w-56 placeholder-parchment-300/50"
              placeholder="剧本名称"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-ink-800 rounded-lg p-1 border border-ink-600">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-md font-serif text-sm transition-all duration-300
                  ${active
                    ? 'bg-amber-warm text-ink-900 shadow-card font-semibold'
                    : 'text-parchment-200/70 hover:text-parchment-100 hover:bg-ink-700/50'
                  }`}
              >
                <Icon size={18} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
