import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Clock, GripVertical } from 'lucide-react';
import { useAppStore } from '@/store';
import type { TimelineEvent } from '@/types';

const emptyEvent: Omit<TimelineEvent, 'id'> = {
  round: 1,
  title: '',
  description: '',
  sortOrder: 0,
};

export function TimelinePanel() {
  const timeline = useAppStore((s) => s.timeline);
  const addTimelineEvent = useAppStore((s) => s.addTimelineEvent);
  const updateTimelineEvent = useAppStore((s) => s.updateTimelineEvent);
  const deleteTimelineEvent = useAppStore((s) => s.deleteTimelineEvent);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<TimelineEvent, 'id'>>(emptyEvent);

  const sorted = [...timeline].sort((a, b) => a.sortOrder - b.sortOrder);
  const maxRound = timeline.reduce((m, t) => Math.max(m, t.round), 0);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm({ ...emptyEvent, round: maxRound + 1, sortOrder: timeline.length });
  };

  const startEdit = (t: TimelineEvent) => {
    setEditingId(t.id);
    setIsCreating(false);
    setForm({
      round: t.round,
      title: t.title,
      description: t.description,
      sortOrder: t.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyEvent);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (isCreating) addTimelineEvent(form);
    else if (editingId) updateTimelineEvent(editingId, form);
    cancelEdit();
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const items = [...sorted];
    [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
    items.forEach((item, i) => updateTimelineEvent(item.id, { sortOrder: i }));
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const items = [...sorted];
    [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
    items.forEach((item, i) => updateTimelineEvent(item.id, { sortOrder: i }));
  };

  const showEditor = isCreating || editingId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">时间线管理</h2>
          <p className="text-ink-600 text-sm mt-1">按游戏轮次组织事件，可拖拽调整顺序</p>
        </div>
        <button onClick={startCreate} className="amber-btn flex items-center gap-2">
          <Plus size={18} /> 新增轮次事件
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
        <div className="lg:col-span-2">
          {sorted.length === 0 && (
            <div className="parchment-card p-12 text-center">
              <Clock size={48} className="mx-auto text-ink-500/40 mb-3" />
              <p className="text-ink-600 font-serif">还没有时间线事件，点击右上角「新增轮次事件」开始创建</p>
            </div>
          )}

          <div className="pl-4">
            {sorted.map((t, idx) => (
              <div key={t.id} className="timeline-node animate-parchment-unroll">
                <div className="timeline-dot">{t.round}</div>
                <div className="flex-1 parchment-card parchment-card-hover p-4 relative group">
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                    <GripVertical size={16} className="text-ink-500" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="ink-title text-lg">{t.title}</h3>
                      <p className="text-xs text-ink-600 font-serif mt-0.5">第 {t.round} 轮 · 事件 {idx + 1}</p>
                      <p className="text-ink-700 text-sm mt-2 leading-relaxed">{t.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 no-print">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 hover:bg-amber-warm/20 text-ink-700 rounded disabled:opacity-30 transition-colors"
                        title="上移"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === sorted.length - 1}
                        className="p-1.5 hover:bg-amber-warm/20 text-ink-700 rounded disabled:opacity-30 transition-colors"
                        title="下移"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => startEdit(t)}
                        className="p-1.5 hover:bg-amber-warm/20 text-ink-700 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTimelineEvent(t.id)}
                        className="p-1.5 hover:bg-seal/20 text-seal rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showEditor && (
          <div className="parchment-card p-5 h-fit sticky top-0 animate-parchment-unroll no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ink-title text-lg">
                {isCreating ? '新增轮次事件' : '编辑轮次事件'}
              </h3>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-ink-700/10 rounded text-ink-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">所属轮次</label>
                <input
                  type="number"
                  min={1}
                  value={form.round}
                  onChange={(e) => setForm({ ...form, round: parseInt(e.target.value) || 1 })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">事件标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="如：初次调查"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">事件描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="textarea-field"
                  placeholder="描述本轮次发生的主要事件..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={submit} className="seal-btn flex-1">
                  {isCreating ? '创建' : '保存'}
                </button>
                <button onClick={cancelEdit} className="ghost-btn">取消</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
