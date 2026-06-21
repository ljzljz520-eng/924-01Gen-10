import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Package } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Item } from '@/types';

const emptyItem: Omit<Item, 'id'> = {
  name: '',
  description: '',
  image: '',
  holderId: '',
  sceneId: '',
};

export function ItemsPanel() {
  const items = useAppStore((s) => s.items);
  const characters = useAppStore((s) => s.characters);
  const scenes = useAppStore((s) => s.scenes);
  const addItem = useAppStore((s) => s.addItem);
  const updateItem = useAppStore((s) => s.updateItem);
  const deleteItem = useAppStore((s) => s.deleteItem);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<Item, 'id'>>(emptyItem);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(emptyItem);
  };

  const startEdit = (i: Item) => {
    setEditingId(i.id);
    setIsCreating(false);
    setForm({
      name: i.name,
      description: i.description,
      image: i.image || '',
      holderId: i.holderId || '',
      sceneId: i.sceneId || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyItem);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (isCreating) addItem(form);
    else if (editingId) updateItem(editingId, form);
    cancelEdit();
  };

  const showEditor = isCreating || editingId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">道具管理</h2>
          <p className="text-ink-600 text-sm mt-1">创建物证、线索物品，可设置所属位置或持有者</p>
        </div>
        <button onClick={startCreate} className="amber-btn flex items-center gap-2">
          <Plus size={18} /> 新增道具
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 && (
            <div className="parchment-card p-12 text-center">
              <Package size={48} className="mx-auto text-ink-500/40 mb-3" />
              <p className="text-ink-600 font-serif">还没有道具，点击右上角「新增道具」开始创建</p>
            </div>
          )}

          {items.map((item) => {
            const holder = characters.find((c) => c.id === item.holderId);
            const scene = scenes.find((s) => s.id === item.sceneId);
            return (
              <div
                key={item.id}
                className="parchment-card parchment-card-hover p-5 animate-parchment-unroll flex gap-4"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover border border-parchment-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-parchment-200/50 border border-parchment-200 flex items-center justify-center flex-shrink-0">
                    <Package size={32} className="text-ink-500/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="ink-title text-lg">{item.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 hover:bg-amber-warm/20 text-ink-700 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 hover:bg-seal/20 text-seal rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-ink-700 text-sm mt-1 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {holder && (
                      <span className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif">
                        👤 持有者：{holder.name}
                      </span>
                    )}
                    {scene && (
                      <span className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif">
                        📍 所在场景：{scene.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showEditor && (
          <div className="parchment-card p-5 h-fit sticky top-0 animate-parchment-unroll no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ink-title text-lg">{isCreating ? '新增道具' : '编辑道具'}</h3>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-ink-700/10 rounded text-ink-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">道具名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="如：破碎的花瓶"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">图片 URL（可选）</label>
                <input
                  type="text"
                  value={form.image || ''}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">道具描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="textarea-field"
                  placeholder="描述道具的外观、特征..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">持有者角色</label>
                <select
                  value={form.holderId || ''}
                  onChange={(e) => setForm({ ...form, holderId: e.target.value || undefined })}
                  className="select-field"
                >
                  <option value="">—— 未指定 ——</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">所在场景</label>
                <select
                  value={form.sceneId || ''}
                  onChange={(e) => setForm({ ...form, sceneId: e.target.value || undefined })}
                  className="select-field"
                >
                  <option value="">—— 未指定 ——</option>
                  {scenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
