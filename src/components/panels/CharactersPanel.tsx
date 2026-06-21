import { useState } from 'react';
import { Plus, Trash2, Edit2, X, User } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Character } from '@/types';

const emptyCharacter: Omit<Character, 'id'> = {
  name: '',
  description: '',
  secretInfo: '',
  tags: [],
};

export function CharactersPanel() {
  const characters = useAppStore((s) => s.characters);
  const addCharacter = useAppStore((s) => s.addCharacter);
  const updateCharacter = useAppStore((s) => s.updateCharacter);
  const deleteCharacter = useAppStore((s) => s.deleteCharacter);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<Omit<Character, 'id'>>(emptyCharacter);
  const [tagInput, setTagInput] = useState('');

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setForm(emptyCharacter);
    setTagInput('');
  };

  const startEdit = (c: Character) => {
    setEditingId(c.id);
    setIsCreating(false);
    setForm({
      name: c.name,
      avatar: c.avatar,
      description: c.description,
      secretInfo: c.secretInfo,
      tags: [...c.tags],
    });
    setTagInput('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyCharacter);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (isCreating) {
      addCharacter(form);
    } else if (editingId) {
      updateCharacter(editingId, form);
    }
    cancelEdit();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setForm({ ...form, tags: form.tags.filter((x) => x !== t) });
  };

  const showEditor = isCreating || editingId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="ink-title text-2xl">角色管理</h2>
          <p className="text-ink-600 text-sm mt-1">创建剧本中的所有角色，包括公开信息和隐藏秘密</p>
        </div>
        <button onClick={startCreate} className="amber-btn flex items-center gap-2">
          <Plus size={18} /> 新增角色
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
        <div className="lg:col-span-2 space-y-4">
          {characters.length === 0 && (
            <div className="parchment-card p-12 text-center">
              <User size={48} className="mx-auto text-ink-500/40 mb-3" />
              <p className="text-ink-600 font-serif">还没有角色，点击右上角「新增角色」开始创建</p>
            </div>
          )}

          {characters.map((c) => (
            <div key={c.id} className="parchment-card parchment-card-hover p-5 animate-parchment-unroll">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-amber-warm/30 border-2 border-amber-warm/50 flex items-center justify-center text-2xl flex-shrink-0">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={24} className="text-ink-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="ink-title text-xl">{c.name}</h3>
                      {c.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-ink-700/10 text-ink-700 px-2 py-0.5 rounded-full font-serif"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-ink-700 text-sm mt-3 leading-relaxed">{c.description}</p>
                  {c.secretInfo && (
                    <div className="mt-3 p-3 bg-seal/5 rounded border border-seal/20">
                      <p className="text-xs text-seal font-serif font-semibold mb-1">🔒 仅主持人可见</p>
                      <p className="text-sm text-ink-700">{c.secretInfo}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(c)}
                    className="p-2 hover:bg-amber-warm/20 text-ink-700 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteCharacter(c.id)}
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
              <h3 className="ink-title text-lg">{isCreating ? '新增角色' : '编辑角色'}</h3>
              <button onClick={cancelEdit} className="p-1.5 hover:bg-ink-700/10 rounded text-ink-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">角色名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="如：陈侦探"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">头像 URL（可选）</label>
                <input
                  type="text"
                  value={form.avatar || ''}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">角色描述（玩家可见）</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="textarea-field"
                  placeholder="角色的公开介绍..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">
                  🔒 隐藏信息（仅主持人可见）
                </label>
                <textarea
                  value={form.secretInfo}
                  onChange={(e) => setForm({ ...form, secretInfo: e.target.value })}
                  className="textarea-field"
                  placeholder="角色的秘密、真实身份、动机等..."
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-ink-700 mb-1.5">标签</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input-field flex-1"
                    placeholder="输入后按回车添加"
                  />
                  <button onClick={addTag} className="ghost-btn px-3">添加</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-amber-warm/20 text-ink-800 px-2 py-1 rounded-full font-serif flex items-center gap-1"
                      >
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-seal">×</button>
                      </span>
                    ))}
                  </div>
                )}
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
