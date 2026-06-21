import { useState, useRef } from 'react';
import { Download, Printer, FileJson, Upload, Users, Lock } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Clue, Character, Scene, Item } from '@/types';

function PlayerPrintCard({ clue }: { clue: Clue }) {
  return (
    <div className="print-player-card bg-parchment-100 border-2 border-parchment-300 rounded-lg p-4 h-full flex flex-col break-inside-avoid">
      <h4 className="font-serif font-bold text-ink-900 text-sm mb-2 pb-2 border-b border-parchment-300">
        {clue.title}
      </h4>
      {clue.image && (
        <img src={clue.image} alt={clue.title} className="w-full h-20 object-cover rounded mb-2" />
      )}
      <p className="text-ink-800 text-xs leading-relaxed flex-1 whitespace-pre-wrap">
        {clue.content}
      </p>
    </div>
  );
}

function HostPrintCard({
  clue,
  characters,
  scenes,
  items,
}: {
  clue: Clue;
  characters: Character[];
  scenes: Scene[];
  items: Item[];
}) {
  const conditionLabel = (() => {
    switch (clue.condition.type) {
      case 'round':
        return `第 ${clue.condition.round} 轮发放`;
      case 'scene':
        const sc = scenes.find((s) => s.id === clue.condition.sceneId);
        return `场景触发：${sc?.name || '未知'}`;
      case 'item':
        const it = items.find((i) => i.id === clue.condition.itemId);
        return `道具触发：${it?.name || '未知'}`;
      default:
        return clue.condition.customDescription || '自定义';
    }
  })();

  const related = [
    ...clue.relatedCharacterIds.map((id) => {
      const c = characters.find((x) => x.id === id);
      return c ? `👤${c.name}` : null;
    }),
    ...clue.relatedSceneIds.map((id) => {
      const s = scenes.find((x) => x.id === id);
      return s ? `📍${s.name}` : null;
    }),
    ...clue.relatedItemIds.map((id) => {
      const i = items.find((x) => x.id === id);
      return i ? `📦${i.name}` : null;
    }),
  ].filter(Boolean);

  return (
    <div className="print-host-card bg-parchment-100 border-2 border-seal/30 rounded-lg p-4 mb-4 break-inside-avoid">
      <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b border-parchment-300">
        <h4 className="font-serif font-bold text-ink-900 text-base">{clue.title}</h4>
        <span className="text-xs bg-seal/10 text-seal px-2 py-0.5 rounded-full border border-seal/30 font-serif flex-shrink-0">
          {conditionLabel}
        </span>
      </div>
      <p className="text-ink-800 text-xs leading-relaxed mb-2 whitespace-pre-wrap">
        {clue.content}
      </p>
      {related.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {related.map((r, i) => (
            <span key={i} className="text-xs bg-ink-700/10 text-ink-700 px-1.5 py-0.5 rounded font-serif">
              {r}
            </span>
          ))}
        </div>
      )}
      {clue.secretNotes && (
        <div className="p-2 bg-seal/5 rounded border border-seal/20">
          <p className="text-xs text-seal font-serif font-semibold mb-0.5">🔑 主持人密钥</p>
          <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">
            {clue.secretNotes}
          </p>
        </div>
      )}
    </div>
  );
}

export function ExportPanel() {
  const {
    script,
    clues,
    characters,
    scenes,
    items,
    timeline,
    exportScript,
    importScript,
  } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'player' | 'host' | 'json'>('player');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const json = exportScript();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name || '剧本'}_数据.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (confirm('导入将覆盖当前所有数据，确定继续吗？')) {
        importScript(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const sortedTimeline = [...timeline].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">导出中心</h2>
          <p className="text-ink-600 text-sm mt-1">导出打印版线索卡或备份剧本数据</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
          <button onClick={handleImportClick} className="ghost-btn flex items-center gap-2">
            <Upload size={16} /> 导入 JSON
          </button>
          <button onClick={handleDownloadJSON} className="ghost-btn flex items-center gap-2">
            <FileJson size={16} /> 下载 JSON
          </button>
          <button onClick={handlePrint} className="seal-btn flex items-center gap-2">
            <Printer size={16} /> 打印
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4 bg-parchment-200/40 rounded-lg p-1 border border-parchment-200 w-fit no-print">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-serif transition-all
            ${activeTab === 'player' ? 'bg-amber-warm text-ink-900 font-semibold' : 'text-ink-600 hover:text-ink-800'}`}
        >
          <Users size={16} /> 玩家线索卡
        </button>
        <button
          onClick={() => setActiveTab('host')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-serif transition-all
            ${activeTab === 'host' ? 'bg-amber-warm text-ink-900 font-semibold' : 'text-ink-600 hover:text-ink-800'}`}
        >
          <Lock size={16} /> 主持人密钥
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-serif transition-all
            ${activeTab === 'json' ? 'bg-amber-warm text-ink-900 font-semibold' : 'text-ink-600 hover:text-ink-800'}`}
        >
          <FileJson size={16} /> 数据概览
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'player' && (
          <>
            <div className="no-print parchment-card p-4 mb-4">
              <div className="flex items-start gap-3">
                <Users size={20} className="text-amber-warm flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-ink-900 mb-1">玩家线索卡打印版</h3>
                  <p className="text-sm text-ink-600">
                    每张卡片仅包含玩家可见的线索内容。A4 纸每页 9 张（3×3），建议使用 250g 铜版纸打印后裁剪。
                    共 {clues.length} 张线索卡。
                  </p>
                </div>
              </div>
            </div>

            <div className="print-area-player">
              <div className="print-only text-center mb-6">
                <h1 className="font-serif text-3xl font-bold text-ink-900">{script.name}</h1>
                <p className="text-ink-600 mt-1">—— 玩家线索卡 ——</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
                {clues.map((c) => (
                  <PlayerPrintCard key={c.id} clue={c} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'host' && (
          <>
            <div className="no-print parchment-card p-4 mb-4">
              <div className="flex items-start gap-3">
                <Lock size={20} className="text-seal flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-semibold text-ink-900 mb-1">主持人密钥打印版</h3>
                  <p className="text-sm text-ink-600">
                    包含所有线索的完整信息：发放条件、关联元素、以及仅主持人可见的秘密备注。
                    请妥善保管，勿让玩家看到。
                  </p>
                </div>
              </div>
            </div>

            <div className="print-area-host">
              <div className="print-only text-center mb-6">
                <h1 className="font-serif text-3xl font-bold text-seal">🔒 {script.name}</h1>
                <p className="text-ink-600 mt-1">—— 主持人密钥 · 绝密 ——</p>
              </div>
              <div className="space-y-0 print:columns-2 print:gap-4">
                {clues.map((c) => (
                  <HostPrintCard
                    key={c.id}
                    clue={c}
                    characters={characters}
                    scenes={scenes}
                    items={items}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'json' && (
          <div className="space-y-4 no-print">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '角色', count: characters.length, icon: '👤' },
                { label: '场景', count: scenes.length, icon: '📍' },
                { label: '道具', count: items.length, icon: '📦' },
                { label: '线索卡', count: clues.length, icon: '🔍' },
              ].map((s) => (
                <div key={s.label} className="parchment-card p-4 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-3xl font-serif font-bold text-ink-900">{s.count}</div>
                  <div className="text-sm text-ink-600 font-serif">{s.label}</div>
                </div>
              ))}
            </div>

            {sortedTimeline.length > 0 && (
              <div className="parchment-card p-5">
                <h3 className="ink-title text-lg mb-3">时间线 / 轮次</h3>
                <div className="pl-4">
                  {sortedTimeline.map((t) => (
                    <div key={t.id} className="timeline-node">
                      <div className="timeline-dot">{t.round}</div>
                      <div>
                        <h4 className="font-serif font-semibold text-ink-900">{t.title}</h4>
                        <p className="text-sm text-ink-600 mt-0.5">{t.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="parchment-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="ink-title text-lg">剧本数据</h3>
                <button onClick={handleDownloadJSON} className="amber-btn flex items-center gap-2 text-sm">
                  <Download size={14} /> 下载 JSON 备份
                </button>
              </div>
              <pre className="text-xs bg-ink-900/5 rounded p-3 overflow-x-auto text-ink-700 max-h-80 overflow-y-auto">
                {exportScript()}
              </pre>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; background-image: none !important; }
          .print-area-player, .print-area-host {
            padding: 0 !important;
          }
          .print-player-card {
            width: 90mm !important;
            height: 54mm !important;
          }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
    </div>
  );
}
