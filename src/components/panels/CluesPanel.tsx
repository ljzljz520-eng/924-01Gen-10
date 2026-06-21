import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, X, FileQuestion, Search, Filter } from 'lucide-react';
import { useAppStore } from '@/store';
import { ClueCard } from '@/components/ClueCard';
import type { Clue, ReleaseCondition, ConditionType } from '@/types';

const emptyClue: Omit<Clue, 'id' | 'isReleased'> = {
  title: '',
  content: '',
  image: '',
  secretNotes: '',
  relatedCharacterIds: [],
  relatedSceneIds: [],
  relatedItemIds: [],
  condition: { type: 'round', round: 1 },
};

type FilterStatus = 'all' | 'unreleased' | 'released';

export function CluesPanel() {
  const clues = useAppStore((s) => s.clues);
  const characters = useAppStore((s) => s.characters);
  const scenes = useAppStore((s) => s.scenes);
  const items = useAppStore((s) => s.items);
  const addClue = useAppStore((s) => s.addClue);
  const updateClue = useAppStore((s) => s.updateClue);
  const deleteClue = useAppStore((s) => s.deleteClue);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<Clue, 'id' | 'isReleased'>>(emptyClue);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filteredClues = useMemo(() => {
    return clues.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.content.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'all' ||
        (filter === 'released' && c.isReleased) ||
        (filter === 'unreleased' && !c.isReleased);
      return matchSearch && matchFilter;
    });
  }, [clues, search, filter]);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(emptyClue);
  };

  const startEdit = (c: Clue) => {
    setEditingId(c.id);
    setIsCreating(false);
    setForm({
      title: c.title,
      content: c.content,
      image: c.image || '',
      secretNotes: c.secretNotes,
      relatedCharacterIds: [...c.relatedCharacterIds],
      relatedSceneIds: [...c.relatedSceneIds],
      relatedItemIds: [...c.relatedItemIds],
      condition: { ...c.condition },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyClue);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (isCreating) addClue(form);
    else if (editingId) updateClue(editingId, form);
    cancelEdit();
  };

  const toggleRelated = (type: 'character' | 'scene' | 'item', id: string) => {
    const key =
      type === 'character'
        ? 'relatedCharacterIds'
        : type === 'scene'
        ? 'relatedSceneIds'
        : 'relatedItemIds';
    const arr = form[key];
    setForm({
      ...form,
      [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    } as typeof form);
  };

  const setConditionType = (type: ConditionType) => {
    const cond: ReleaseCondition = { type };
    if (type === 'round') cond.round = 1;
    setForm({ ...form, condition: cond });
  };

  const showEditor = isCreating || editingId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">线索卡管理</h2>
          <p className="text-ink-600 text-sm mt-1">创建和编辑线索卡，设置发放条件</p>
        </div>
        <button onClick={startCreate} className="seal-btn flex items-center gap-2">
          <Plus size={18} /> 新增线索卡
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4 no-print">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="搜索线索标题或内容..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-parchment-200/40 rounded-lg p-1 border border-parchment-200">
          <Filter size={14} className="text-ink-500 ml-2" />
          {(['all', 'unreleased', 'released'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-xs font-serif transition-all
                ${filter === f
                  ? 'bg-amber-warm text-ink-900 font-semibold'
                  : 'text-ink-600 hover:text-ink-800'
                }`}
            >
              {f === 'all' ? '全部' : f === 'unreleased' ? '未发放' : '已发放'}
            </button>
          ))}
        </div>
        <div className="text-sm text-ink-600 font-serif ml-auto">
          共 {clues.length} 张线索卡 · {clues.filter((c) => c.isReleased).length} 已发放
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-y-auto pr-2">
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          {filteredClues.length === 0 && (
            <div className="parchment-card p-12 text-center md:col-span-2">
              <FileQuestion size={48} className="mx-auto text-ink-500/40 mb-3" />
              <p className="text-ink-600 font-serif">没有找到符合条件的线索卡</p>
            </div>
          )}

          {filteredClues.map((c) => (
            <div key={c.id} className="relative group animate-parchment-unroll">
              <ClueCard
                clue={c}
                characters={characters}
                scenes={scenes}
                items={items}
                variant="host"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                <button
                  onClick={() => startEdit(c)}
                  className="p-1.5 bg-parchment-100 hover:bg-amber-warm/50 text-ink-700 rounded shadow-card border border-parchment-200 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => deleteClue(c.id)}
                  className="p-1.5 bg-parchment-100 hover:bg-seal/20 text-seal rounded shadow-card border border-parchment-200 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showEditor && (
          <div className="parchment-card p-5 h-fit sticky top-0 animate-parchment-unroll no-print xl:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ink-title text-lg">
                {isCreating ? '新增线索卡' : '编辑线索卡'}
              </h3>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-ink-700/10 rounded text-ink-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">线索标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="如：花瓶碎片上的指纹"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">配图 URL（可选）</label>
                <input
                  type="text"
                  value={form.image || ''}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">线索内容（玩家可见）</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="textarea-field"
                  rows={4}
                  placeholder="描述线索的外观、内容等玩家可见的信息..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">
                  🔒 主持人密钥备注
                </label>
                <textarea
                  value={form.secretNotes}
                  onChange={(e) => setForm({ ...form, secretNotes: e.target.value })}
                  className="textarea-field"
                  rows={3}
                  placeholder="线索的真实含义、隐藏关联等仅主持人可见的信息..."
                />
              </div>

              <div className="divider-ink" />

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-2">关联信息</label>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-serif text-ink-600 mb-1">关联角色</p>
                    <div className="flex flex-wrap gap-1">
                      {characters.length === 0 && <span className="text-xs text-ink-500">暂无角色</span>}
                      {characters.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => toggleRelated('character', c.id)}
                          className={`text-xs px-2 py-1 rounded-full font-serif border transition-all
                            ${form.relatedCharacterIds.includes(c.id)
                              ? 'bg-amber-warm/40 border-amber-warm text-ink-900'
                              : 'bg-parchment-50 border-parchment-200 text-ink-600 hover:border-ink-500'
                            }`}
                        >
                          👤 {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-serif text-ink-600 mb-1">关联场景</p>
                    <div className="flex flex-wrap gap-1">
                      {scenes.length === 0 && <span className="text-xs text-ink-500">暂无场景</span>}
                      {scenes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => toggleRelated('scene', s.id)}
                          className={`text-xs px-2 py-1 rounded-full font-serif border transition-all
                            ${form.relatedSceneIds.includes(s.id)
                              ? 'bg-amber-warm/40 border-amber-warm text-ink-900'
                              : 'bg-parchment-50 border-parchment-200 text-ink-600 hover:border-ink-500'
                            }`}
                        >
                          📍 {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-serif text-ink-600 mb-1">关联道具</p>
                    <div className="flex flex-wrap gap-1">
                      {items.length === 0 && <span className="text-xs text-ink-500">暂无道具</span>}
                      {items.map((i) => (
                        <button
                          key={i.id}
                          onClick={() => toggleRelated('item', i.id)}
                          className={`text-xs px-2 py-1 rounded-full font-serif border transition-all
                            ${form.relatedItemIds.includes(i.id)
                              ? 'bg-amber-warm/40 border-amber-warm text-ink-900'
                              : 'bg-parchment-50 border-parchment-200 text-ink-600 hover:border-ink-500'
                            }`}
                        >
                          📦 {i.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider-ink" />

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-2">发放条件</label>
                <div className="space-y-3">
                  <div className="flex gap-1 flex-wrap">
                    {(['round', 'scene', 'item', 'custom'] as ConditionType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setConditionType(t)}
                        className={`text-xs px-3 py-1.5 rounded font-serif border transition-all
                          ${form.condition.type === t
                            ? 'bg-seal/15 border-seal/40 text-seal font-semibold'
                            : 'bg-parchment-50 border-parchment-200 text-ink-600 hover:border-ink-500'
                          }`}
                      >
                        {t === 'round' ? '按轮次' : t === 'scene' ? '场景触发' : t === 'item' ? '道具触发' : '自定义'}
                      </button>
                    ))}
                  </div>

                  {form.condition.type === 'round' && (
                    <div>
                      <label className="block text-xs font-serif text-ink-600 mb-1">在第几轮发放</label>
                      <input
                        type="number"
                        min={1}
                        value={form.condition.round ?? 1}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            condition: { ...form.condition, round: parseInt(e.target.value) || 1 },
                          })
                        }
                        className="input-field w-32"
                      />
                    </div>
                  )}

                  {form.condition.type === 'scene' && (
                    <div>
                      <label className="block text-xs font-serif text-ink-600 mb-1">进入哪个场景后发放</label>
                      <select
                        value={form.condition.sceneId || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            condition: { ...form.condition, sceneId: e.target.value || undefined },
                          })
                        }
                        className="select-field"
                      >
                        <option value="">选择场景...</option>
                        {scenes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {form.condition.type === 'item' && (
                    <div>
                      <label className="block text-xs font-serif text-ink-600 mb-1">获得哪个道具后发放</label>
                      <select
                        value={form.condition.itemId || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            condition: { ...form.condition, itemId: e.target.value || undefined },
                          })
                        }
                        className="select-field"
                      >
                        <option value="">选择道具...</option>
                        {items.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {form.condition.type === 'custom' && (
                    <div>
                      <label className="block text-xs font-serif text-ink-600 mb-1">自定义条件描述</label>
                      <input
                        type="text"
                        value={form.condition.customDescription || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            condition: { ...form.condition, customDescription: e.target.value },
                          })
                        }
                        className="input-field"
                        placeholder="如：玩家投票后..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {showEditor && (
                <div className="pt-3 border-t border-parchment-200">
                  <p className="text-xs font-serif text-ink-600 mb-2">👁️ 实时预览</p>
                  <ClueCard
                    clue={{
                      ...form,
                      id: 'preview',
                      isReleased: false,
                    }}
                    characters={characters}
                    scenes={scenes}
                    items={items}
                    variant="preview"
                    className="!cursor-default"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2 sticky bottom-0 bg-parchment-100 py-2">
                <button onClick={submit} className="seal-btn flex-1">
                  {isCreating ? '创建线索卡' : '保存修改'}
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
