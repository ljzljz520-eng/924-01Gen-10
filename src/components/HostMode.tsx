import { useState, useMemo } from 'react';
import {
  Play,
  SkipForward,
  SkipBack,
  RotateCcw,
  Send,
  Lock,
  Eye,
  CheckCircle2,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAppStore, isClueAvailable } from '@/store';
import { ClueCard } from '@/components/ClueCard';

export function HostMode() {
  const clues = useAppStore((s) => s.clues);
  const characters = useAppStore((s) => s.characters);
  const scenes = useAppStore((s) => s.scenes);
  const items = useAppStore((s) => s.items);
  const timeline = useAppStore((s) => s.timeline);
  const gameState = useAppStore((s) => s.gameState);
  const startGame = useAppStore((s) => s.startGame);
  const nextRound = useAppStore((s) => s.nextRound);
  const prevRound = useAppStore((s) => s.prevRound);
  const releaseClue = useAppStore((s) => s.releaseClue);
  const resetGame = useAppStore((s) => s.resetGame);
  const scriptName = useAppStore((s) => s.script.name);

  const [view, setView] = useState<'clues' | 'key'>('clues');
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);

  const sortedTimeline = useMemo(
    () => [...timeline].sort((a, b) => a.sortOrder - b.sortOrder),
    [timeline]
  );

  const currentEvent = sortedTimeline.find((t) => t.round === gameState.currentRound);
  const maxRound = useMemo(() => {
    const maxFromTimeline = timeline.reduce((m, t) => Math.max(m, t.round), 0);
    const maxFromClues = clues.reduce((m, c) => Math.max(m, c.condition.round ?? 0), 0);
    return Math.max(maxFromTimeline, maxFromClues, 1);
  }, [timeline, clues]);

  const availableClues = useMemo(
    () => clues.filter((c) => isClueAvailable(c, gameState)),
    [clues, gameState]
  );

  const releasedClues = useMemo(
    () => clues.filter((c) => c.isReleased),
    [clues]
  );

  const unreleasedClues = useMemo(
    () => clues.filter((c) => !c.isReleased),
    [clues]
  );

  const selectedClue = selectedClueId
    ? clues.find((c) => c.id === selectedClueId)
    : null;

  const gameStarted = gameState.releasedClueIds.length > 0 || !!gameState.startedAt;

  const handleRelease = (id: string) => {
    releaseClue(id);
    setSelectedClueId(null);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      <div className="no-print bg-ink-800/40 backdrop-blur-sm border-b border-amber-warm/10 px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-amber-warm" />
              <div>
                <p className="text-xs text-parchment-200/60 font-serif">当前轮次</p>
                <p className="text-3xl font-serif font-bold text-parchment-100">
                  第 {gameState.currentRound} 轮
                  <span className="text-sm font-normal text-parchment-200/50 ml-2">
                    / 共 {maxRound} 轮
                  </span>
                </p>
              </div>
            </div>

            <div className="h-12 w-px bg-ink-600/50" />

            <div className="flex items-center gap-3">
              <FileText size={20} className="text-amber-warm" />
              <div>
                <p className="text-xs text-parchment-200/60 font-serif">发放进度</p>
                <p className="text-lg font-serif text-parchment-100">
                  {releasedClues.length} / {clues.length} 张线索
                </p>
                <div className="w-40 h-2 bg-ink-700 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-warm to-amber-dark rounded-full transition-all duration-500"
                    style={{
                      width: clues.length > 0 ? `${(releasedClues.length / clues.length) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>

            {currentEvent && (
              <>
                <div className="h-12 w-px bg-ink-600/50" />
                <div className="max-w-md">
                  <p className="text-xs text-parchment-200/60 font-serif">本轮事件</p>
                  <p className="text-parchment-100 font-serif font-medium">
                    {currentEvent.title}
                  </p>
                  <p className="text-xs text-parchment-200/50 mt-0.5 line-clamp-1">
                    {currentEvent.description}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!gameStarted ? (
              <button
                onClick={startGame}
                className="seal-btn flex items-center gap-2"
              >
                <Play size={18} /> 开始游戏
              </button>
            ) : (
              <>
                <button
                  onClick={prevRound}
                  disabled={gameState.currentRound <= 1}
                  className="ghost-btn flex items-center gap-1.5 disabled:opacity-40"
                >
                  <SkipBack size={16} /> 上一轮
                </button>
                <button
                  onClick={nextRound}
                  disabled={gameState.currentRound >= maxRound}
                  className="amber-btn flex items-center gap-1.5 disabled:opacity-40"
                >
                  下一轮 <SkipForward size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要重置游戏进度吗？所有已发放线索将被恢复。')) {
                      resetGame();
                    }
                  }}
                  className="ghost-btn flex items-center gap-1.5 text-seal border-seal/30 hover:bg-seal/10"
                >
                  <RotateCcw size={16} /> 重置
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="no-print flex items-center gap-1 bg-ink-700/30 px-8 py-2 border-b border-ink-600/30">
        <button
          onClick={() => setView('clues')}
          className={`px-4 py-1.5 rounded font-serif text-sm transition-all
            ${view === 'clues'
              ? 'bg-amber-warm/20 text-amber-warm font-semibold'
              : 'text-parchment-200/60 hover:text-parchment-100'
            }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={14} /> 线索发放
          </span>
        </button>
        <button
          onClick={() => setView('key')}
          className={`px-4 py-1.5 rounded font-serif text-sm transition-all
            ${view === 'key'
              ? 'bg-amber-warm/20 text-amber-warm font-semibold'
              : 'text-parchment-200/60 hover:text-parchment-100'
            }`}
        >
          <span className="flex items-center gap-2">
            <Lock size={14} /> 主持人密钥
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-ink-900/20">
        {view === 'clues' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-parchment-100 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-warm" />
                  本轮可发放 ({availableClues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {availableClues.length === 0 ? (
                  <div className="parchment-card p-8 text-center">
                    <Eye size={32} className="mx-auto text-ink-500/40 mb-2" />
                    <p className="text-ink-600 text-sm font-serif">
                      当前轮次暂无可发放线索
                    </p>
                  </div>
                ) : (
                  availableClues.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClueId(c.id)}
                      className={`cursor-pointer transition-all
                        ${selectedClueId === c.id ? 'ring-2 ring-amber-warm rounded-lg' : ''}
                      `}
                    >
                      <ClueCard
                        clue={c}
                        characters={characters}
                        scenes={scenes}
                        items={items}
                        variant="player"
                        className="!cursor-pointer hover:scale-[1.01]"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-parchment-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  已发放 ({releasedClues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {releasedClues.length === 0 ? (
                  <div className="parchment-card p-8 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-ink-500/40 mb-2" />
                    <p className="text-ink-600 text-sm font-serif">
                      还没有发放任何线索
                    </p>
                  </div>
                ) : (
                  releasedClues.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClueId(c.id)}
                      className={`cursor-pointer transition-all opacity-80
                        ${selectedClueId === c.id ? 'ring-2 ring-amber-warm rounded-lg' : ''}
                      `}
                    >
                      <ClueCard
                        clue={c}
                        characters={characters}
                        scenes={scenes}
                        items={items}
                        variant="player"
                        className="!cursor-pointer"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-parchment-100 flex items-center gap-2">
                  <Eye size={18} className="text-parchment-200/50" />
                  尚未解锁 ({unreleasedClues.filter((c) => !availableClues.includes(c)).length})
                </h3>
              </div>
              <div className="space-y-2">
                {unreleasedClues
                  .filter((c) => !availableClues.includes(c))
                  .length === 0 ? (
                  <div className="parchment-card p-8 text-center">
                    <p className="text-ink-600 text-sm font-serif">
                      所有线索已解锁
                    </p>
                  </div>
                ) : (
                  unreleasedClues
                    .filter((c) => !availableClues.includes(c))
                    .map((c) => (
                      <div
                        key={c.id}
                        className="parchment-card p-3 opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <Lock size={16} className="text-ink-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-sm text-ink-800 font-medium truncate">
                              {c.title}
                            </p>
                            <p className="text-xs text-ink-600">
                              {c.condition.type === 'round' && `第 ${c.condition.round} 轮解锁`}
                              {c.condition.type === 'scene' && '场景触发解锁'}
                              {c.condition.type === 'item' && '道具触发解锁'}
                              {c.condition.type === 'custom' && '自定义条件'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {selectedClue && (
                <div className="mt-6 parchment-card p-4 animate-parchment-unroll">
                  <p className="font-serif font-semibold text-ink-900 mb-2">
                    {selectedClue.title}
                  </p>
                  {selectedClue.secretNotes && (
                    <div className="mb-3 p-2.5 bg-seal/5 rounded border border-seal/20">
                      <p className="text-xs text-seal font-serif font-semibold mb-1">🔒 主持人密钥</p>
                      <p className="text-xs text-ink-700 leading-relaxed">
                        {selectedClue.secretNotes}
                      </p>
                    </div>
                  )}
                  {!selectedClue.isReleased && (
                    <button
                      onClick={() => handleRelease(selectedClue.id)}
                      className="seal-btn w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <Send size={16} /> 发放此线索
                    </button>
                  )}
                  {selectedClue.isReleased && (
                    <div className="text-center text-xs text-ink-600 font-serif py-1">
                      ✓ 已于第 {selectedClue.releasedInRound} 轮发放
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'key' && (
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-6 parchment-card p-5">
              <h3 className="font-serif text-xl font-semibold text-ink-900 flex items-center gap-2 mb-3">
                <Lock size={20} className="text-seal" />
                主持人密钥 · {scriptName}
              </h3>
              <p className="text-sm text-ink-600">
                此页面展示所有线索的完整信息（含隐藏备注），仅主持人可见。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clues.map((c) => (
                <ClueCard
                  key={c.id}
                  clue={c}
                  characters={characters}
                  scenes={scenes}
                  items={items}
                  variant="host"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
