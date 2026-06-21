import { Users, MapPin, Package, Clock, FileQuestion, Download } from 'lucide-react';
import { useAppStore } from '@/store';
import type { CreatorTab } from '@/types';

const tabs: { id: CreatorTab; label: string; icon: typeof Users }[] = [
  { id: 'characters', label: '角色管理', icon: Users },
  { id: 'scenes', label: '场景管理', icon: MapPin },
  { id: 'items', label: '道具管理', icon: Package },
  { id: 'timeline', label: '时间线', icon: Clock },
  { id: 'clues', label: '线索卡', icon: FileQuestion },
  { id: 'export', label: '导出中心', icon: Download },
];

export function CreatorSidebar() {
  const activeTab = useAppStore((s) => s.creatorActiveTab);
  const setTab = useAppStore((s) => s.setCreatorTab);
  const charCount = useAppStore((s) => s.characters.length);
  const sceneCount = useAppStore((s) => s.scenes.length);
  const itemCount = useAppStore((s) => s.items.length);
  const tlCount = useAppStore((s) => s.timeline.length);
  const clueCount = useAppStore((s) => s.clues.length);

  const counts = {
    characters: charCount,
    scenes: sceneCount,
    items: itemCount,
    timeline: tlCount,
    clues: clueCount,
  };

  return (
    <aside className="no-print w-64 bg-ink-800/60 backdrop-blur-sm border-r border-ink-600/50 flex flex-col">
      <div className="p-4 border-b border-ink-600/50">
        <h2 className="font-serif text-amber-warm text-lg font-semibold flex items-center gap-2">
          <span>📜</span> 作者工作台
        </h2>
        <p className="text-parchment-200/50 text-xs mt-1">构建你的推理世界</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`nav-item group ${active ? 'nav-item-active' : 'text-parchment-200/80 hover:text-parchment-100'}`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="flex-1 font-serif">{t.label}</span>
              {t.id !== 'export' && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${active ? 'bg-amber-warm/30 text-ink-900' : 'bg-ink-700/50 text-parchment-200/60'}`}>
                  {counts[t.id as keyof typeof counts]}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-ink-600/50">
        <div className="parchment-card p-3">
          <p className="text-xs font-serif text-ink-700 mb-1">💡 提示</p>
          <p className="text-xs text-ink-600 leading-relaxed">
            先创建角色、场景和道具，再设置时间线轮次，最后将线索分配到各轮次。
          </p>
        </div>
      </div>
    </aside>
  );
}
