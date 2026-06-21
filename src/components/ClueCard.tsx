import { Eye, Lock } from 'lucide-react';
import type { Clue, Character, Scene, Item } from '@/types';

interface ClueCardProps {
  clue: Clue;
  characters: Character[];
  scenes: Scene[];
  items: Item[];
  variant?: 'player' | 'host' | 'preview';
  onClick?: () => void;
  className?: string;
}

export function ClueCard({
  clue,
  characters,
  scenes,
  items,
  variant = 'player',
  onClick,
  className = '',
}: ClueCardProps) {
  const showSecret = variant !== 'player';
  const relatedChars = characters.filter((c) =>
    clue.relatedCharacterIds.includes(c.id)
  );
  const relatedScenes = scenes.filter((s) =>
    clue.relatedSceneIds.includes(s.id)
  );
  const relatedItems = items.filter((i) =>
    clue.relatedItemIds.includes(i.id)
  );

  const conditionLabel = (() => {
    switch (clue.condition.type) {
      case 'round':
        return `第 ${clue.condition.round} 轮发放`;
      case 'scene':
        const sc = scenes.find((s) => s.id === clue.condition.sceneId);
        return `场景触发：${sc?.name || '未知场景'}`;
      case 'item':
        const it = items.find((i) => i.id === clue.condition.itemId);
        return `道具触发：${it?.name || '未知道具'}`;
      default:
        return clue.condition.customDescription || '自定义条件';
    }
  })();

  return (
    <div
      onClick={onClick}
      className={`clue-card ${onClick ? 'hover:scale-[1.02]' : ''} ${className}`}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="ink-title text-lg leading-tight flex-1">{clue.title}</h3>
          {clue.isReleased && (
            <span className="text-xs bg-seal/10 text-seal px-2 py-1 rounded-full border border-seal/30 font-serif flex-shrink-0">
              已发放
            </span>
          )}
        </div>

        {clue.image && (
          <div className="mb-3 rounded overflow-hidden border border-parchment-200">
            <img
              src={clue.image}
              alt={clue.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        <p className="text-ink-800 text-sm leading-relaxed font-body whitespace-pre-wrap">
          {clue.content}
        </p>

        {(relatedChars.length > 0 || relatedScenes.length > 0 || relatedItems.length > 0) && (
          <div className="mt-3 pt-3 border-t border-parchment-200/60">
            <div className="flex flex-wrap gap-1.5">
              {relatedChars.map((c) => (
                <span
                  key={c.id}
                  className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                >
                  👤 {c.name}
                </span>
              ))}
              {relatedScenes.map((s) => (
                <span
                  key={s.id}
                  className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                >
                  📍 {s.name}
                </span>
              ))}
              {relatedItems.map((i) => (
                <span
                  key={i.id}
                  className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                >
                  📦 {i.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {variant !== 'player' && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-ink-600 flex items-center gap-1.5 font-serif">
              <Eye size={12} />
              {conditionLabel}
            </div>

            {showSecret && clue.secretNotes && (
              <div className="mt-2 p-2.5 bg-seal/5 rounded border border-seal/20">
                <div className="flex items-center gap-1.5 text-seal text-xs font-serif font-semibold mb-1">
                  <Lock size={12} />
                  主持人密钥
                </div>
                <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">
                  {clue.secretNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {variant === 'preview' && (
          <div className="absolute top-2 right-2 text-xs bg-amber-warm/80 text-ink-900 px-2 py-1 rounded font-serif font-medium">
            预览
          </div>
        )}
      </div>
    </div>
  );
}
