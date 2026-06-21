import { useState } from 'react';
import { Plus, Trash2, Edit2, X, MapPin } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Scene } from '@/types';

const emptyScene: Omit<Scene, 'id'> = {
  name: '',
  description: '',
  relatedCharacterIds: [],
  relatedItemIds: [],
};

export function ScenesPanel() {
  const scenes = useAppStore((s) => s.scenes);
  const characters = useAppStore((s) => s.characters);
  const items = useAppStore((s) => s.items);
  const addScene = useAppStore((s) => s.addScene);
  const updateScene = useAppStore((s) => s.updateScene);
  const deleteScene = useAppStore((s) => s.deleteScene);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<Scene, 'id'>>(emptyScene);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(emptyScene);
  };

  const startEdit = (s: Scene) => {
    setEditingId(s.id);
    setIsCreating(false);
    setForm({
      name: s.name,
      description: s.description,
      relatedCharacterIds: [...s.relatedCharacterIds],
      relatedItemIds: [...s.relatedItemIds],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyScene);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (isCreating) addScene(form);
    else if (editingId) updateScene(editingId, form);
    cancelEdit();
  };

  const toggleChar = (id: string) => {
    setForm({
      ...form,
      relatedCharacterIds: form.relatedCharacterIds.includes(id)
        ? form.relatedCharacterIds.filter((x) => x !== id)
        : [...form.relatedCharacterIds, id],
    });
  };

  const toggleItem = (id: string) => {
    setForm({
      ...form,
      relatedItemIds: form.relatedItemIds.includes(id)
        ? form.relatedItemIds.filter((x) => x !== id)
        : [...form.relatedItemIds, id],
    });
  };

  const showEditor = isCreating || editingId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">场景管理</h2>
          <p className="text-ink-600 text-sm mt-1">定义故事发生的地点和相关元素</p>
        </div>
        <button onClick={startCreate} className="amber-btn flex items-center gap-2">
          <Plus size={18} /> 新增场景
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
        <div className="lg:col-span-2 space-y-4">
          {scenes.length === 0 && (
            <div className="parchment-card p-12 text-center">
              <MapPin size={48} className="mx-auto text-ink-500/40 mb-3" />
              <p className="text-ink-600 font-serif">还没有场景，点击右上角「新增场景」开始创建</p>
            </div>
          )}

          {scenes.map((s) => (
            <div key={s.id} className="parchment-card parchment-card-hover p-5 animate-parchment-unroll">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-ink-600" />
                    <h3 className="ink-title text-xl">{s.name}</h3>
                  </div>
                  <p className="text-ink-700 text-sm leading-relaxed">{s.description}</p>

                  {(s.relatedCharacterIds.length > 0 || s.relatedItemIds.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.relatedCharacterIds.map((cid) => {
                        const c = characters.find((x) => x.id === cid);
                        return c ? (
                          <span
                            key={cid}
                            className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                          >
                            👤 {c.name}
                          </span>
                        ) : null;
                      })}
                      {s.relatedItemIds.map((iid) => {
                        const i = items.find((x) => x.id === iid);
                        return i ? (
                          <span
                            key={iid}
                            className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                          >
                            📦 {i.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(s)}
                    className="p-2 hover:bg-amber-warm/20 text-ink-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteScene(s.id)}
                    className="p-2 hover:bg-seal/20 text-seal rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showEditor && (
          <div className="parchment-card p-5 h-fit sticky top-0 animate-parchment-unroll no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ink-title text-lg">{isCreating ? '新增场景' : '编辑场景'}</h3>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-ink-700/10 rounded text-ink-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">场景名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="如：书房"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">场景描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="textarea-field"
                  placeholder="场景的详细描述..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-2">关联角色</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto border border-parchment-200 rounded p-2 bg-parchment-50">
                  {characters.length === 0 ? (
                    <p className="text-xs text-ink-500">暂无角色，请先创建角色</p>
                  ) : (
                    characters.map((c) => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-parchment-200/50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={form.relatedCharacterIds.includes(c.id)}
                          onChange={() => toggleChar(c.id)}
                          className="rounded border-parchment-300 text-amber-warm focus:ring-amber-warm"
                        />
                        <span className="font-body text-ink-800">{c.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-2">关联道具</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto border border-parchment-200 rounded p-2 bg-parchment-50">
                  {items.length === 0 ? (
                    <p className="text-xs text-ink-500">暂无道具，请先创建道具</p>
                  ) : (
                    items.map((i) => (
                      <label
                        key={i.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-parchment-200/50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={form.relatedItemIds.includes(i.id)}
                          onChange={() => toggleItem(i.id)}
                          className="rounded border-parchment-300 text-amber-warm focus:ring-amber-warm"
                        />
                        <span className="font-body text-ink-800">{i.name}</span>
                      </label>
                    ))
                  )}
                </div>
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
