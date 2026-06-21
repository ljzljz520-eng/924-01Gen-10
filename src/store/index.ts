import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type {
  Script,
  Character,
  Scene,
  Item,
  TimelineEvent,
  Clue,
  GameState,
  CreatorTab,
  AppMode,
  ReleaseCondition,
} from '@/types';

interface AppStore {
  script: Script;
  characters: Character[];
  scenes: Scene[];
  items: Item[];
  timeline: TimelineEvent[];
  clues: Clue[];
  gameState: GameState;
  currentMode: AppMode;
  creatorActiveTab: CreatorTab;

  setScriptName: (name: string) => void;
  setScriptDescription: (description: string) => void;

  addCharacter: (c: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, data: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;

  addScene: (s: Omit<Scene, 'id'>) => void;
  updateScene: (id: string, data: Partial<Scene>) => void;
  deleteScene: (id: string) => void;

  addItem: (i: Omit<Item, 'id'>) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;

  addTimelineEvent: (e: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (id: string, data: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;
  reorderTimeline: (orderedIds: string[]) => void;

  addClue: (c: Omit<Clue, 'id' | 'isReleased'>) => void;
  updateClue: (id: string, data: Partial<Clue>) => void;
  deleteClue: (id: string) => void;

  setMode: (mode: AppMode) => void;
  setCreatorTab: (tab: CreatorTab) => void;
  startGame: () => void;
  nextRound: () => void;
  prevRound: () => void;
  releaseClue: (clueId: string) => void;
  resetGame: () => void;

  exportScript: () => string;
  importScript: (json: string) => void;
}

const now = Date.now();

const initialCharacters: Character[] = [
  {
    id: 'char-1',
    name: '陈侦探',
    description: '声名远扬的私家侦探，洞察力敏锐，受委托调查此案。',
    secretInfo: '实际上是受害者多年前失散的儿子。',
    tags: ['主角', '侦探'],
  },
  {
    id: 'char-2',
    name: '林管家',
    description: '在庄园服务了三十年的老管家，对庄园的一切了如指掌。',
    secretInfo: '暗中保护着某个不为人知的家族秘密。',
    tags: ['佣人', '嫌疑人'],
  },
  {
    id: 'char-3',
    name: '苏小姐',
    description: '受害者的侄女，最近刚从国外回来。',
    secretInfo: '欠下巨额赌债，急需遗产还债。',
    tags: ['亲属', '嫌疑人'],
  },
];

const initialScenes: Scene[] = [
  {
    id: 'scene-1',
    name: '书房',
    description: '二楼的私人书房，门窗从内部反锁，受害者倒在书桌旁。',
    relatedCharacterIds: ['char-1', 'char-2'],
    relatedItemIds: ['item-1', 'item-2'],
  },
  {
    id: 'scene-2',
    name: '花园凉亭',
    description: '后花园的凉亭，可以俯瞰整个庄园，地上有泥土脚印。',
    relatedCharacterIds: ['char-3'],
    relatedItemIds: ['item-3'],
  },
];

const initialItems: Item[] = [
  {
    id: 'item-1',
    name: '破碎的花瓶',
    description: '一个昂贵的青花瓷花瓶，碎片散落在书桌旁。',
    sceneId: 'scene-1',
  },
  {
    id: 'item-2',
    name: '未写完的信',
    description: '书桌上有一封只写了一半的信，墨迹还未干透。',
    sceneId: 'scene-1',
  },
  {
    id: 'item-3',
    name: '沾泥的手套',
    description: '一副白色真丝手套，指尖沾有花园的泥土。',
    holderId: 'char-3',
  },
];

const initialTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    round: 1,
    title: '初次调查',
    description: '众人齐聚庄园大厅，侦探开始初步询问并勘察现场。',
    sortOrder: 0,
  },
  {
    id: 'tl-2',
    round: 2,
    title: '深入盘问',
    description: '逐一询问嫌疑人的不在场证明，搜查各人房间。',
    sortOrder: 1,
  },
  {
    id: 'tl-3',
    round: 3,
    title: '真相浮现',
    description: '关键证据浮出水面，所有线索指向真凶。',
    sortOrder: 2,
  },
];

const initialClues: Clue[] = [
  {
    id: 'clue-1',
    title: '花瓶碎片上的指纹',
    content: '经鉴定，花瓶碎片上检测到林管家的指纹，但他声称只是日常打扫时触碰过。',
    secretNotes: '花瓶其实是案发后被林管家打碎以掩盖另一样东西——瓶底藏着的旧照片。',
    relatedCharacterIds: ['char-2'],
    relatedSceneIds: ['scene-1'],
    relatedItemIds: ['item-1'],
    condition: { type: 'round', round: 1 } as ReleaseCondition,
    isReleased: false,
  },
  {
    id: 'clue-2',
    title: '未完成的信',
    content: '"亲爱的律师，我决定修改遗嘱，将大部分财产留给..." 信到此戛然而止。',
    secretNotes: '受害者原本打算剥夺苏小姐的继承权。这是苏小姐的核心动机。',
    relatedCharacterIds: ['char-3'],
    relatedSceneIds: ['scene-1'],
    relatedItemIds: ['item-2'],
    condition: { type: 'round', round: 2 } as ReleaseCondition,
    isReleased: false,
  },
  {
    id: 'clue-3',
    title: '花园的脚印',
    content: '凉亭附近的泥土中发现了一串女士高跟鞋印，尺码约为37码。',
    secretNotes: '对比苏小姐的鞋子尺码完全吻合。她声称案发时在自己房间，但脚印证明她去过花园。',
    relatedCharacterIds: ['char-3'],
    relatedSceneIds: ['scene-2'],
    relatedItemIds: [],
    condition: { type: 'round', round: 1 } as ReleaseCondition,
    isReleased: false,
  },
  {
    id: 'clue-4',
    title: '神秘来电记录',
    content: '死者手机显示，案发前一周曾多次与一个陌生号码通话，通话时长累计超过3小时。',
    secretNotes: '该号码属于陈侦探的私家侦探社。受害者早已委托陈侦探调查自己家族的秘密。',
    relatedCharacterIds: ['char-1'],
    relatedSceneIds: [],
    relatedItemIds: [],
    condition: { type: 'round', round: 3 } as ReleaseCondition,
    isReleased: false,
  },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      script: {
        id: 'script-default',
        name: '庄园谋杀案',
        description: '一个发生在古老庄园中的悬疑推理故事',
        createdAt: now,
        updatedAt: now,
      },
      characters: initialCharacters,
      scenes: initialScenes,
      items: initialItems,
      timeline: initialTimeline,
      clues: initialClues,
      gameState: {
        currentRound: 1,
        releasedClueIds: [],
      },
      currentMode: 'creator',
      creatorActiveTab: 'characters',

      setScriptName: (name) =>
        set((state) => ({
          script: { ...state.script, name, updatedAt: Date.now() },
        })),

      setScriptDescription: (description) =>
        set((state) => ({
          script: { ...state.script, description, updatedAt: Date.now() },
        })),

      addCharacter: (c) =>
        set((state) => ({
          characters: [...state.characters, { ...c, id: nanoid() }],
        })),

      updateCharacter: (id, data) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
        })),

      addScene: (s) =>
        set((state) => ({
          scenes: [...state.scenes, { ...s, id: nanoid() }],
        })),

      updateScene: (id, data) =>
        set((state) => ({
          scenes: state.scenes.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteScene: (id) =>
        set((state) => ({
          scenes: state.scenes.filter((s) => s.id !== id),
        })),

      addItem: (i) =>
        set((state) => ({
          items: [...state.items, { ...i, id: nanoid() }],
        })),

      updateItem: (id, data) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      addTimelineEvent: (e) =>
        set((state) => ({
          timeline: [...state.timeline, { ...e, id: nanoid() }],
        })),

      updateTimelineEvent: (id, data) =>
        set((state) => ({
          timeline: state.timeline.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      deleteTimelineEvent: (id) =>
        set((state) => ({
          timeline: state.timeline.filter((t) => t.id !== id),
        })),

      reorderTimeline: (orderedIds) =>
        set((state) => {
          const ordered = orderedIds.map(
            (id, idx) =>
              state.timeline.find((t) => t.id === id)?.id && {
                ...state.timeline.find((t) => t.id === id)!,
                sortOrder: idx,
              }
          ) as TimelineEvent[];
          return { timeline: ordered };
        }),

      addClue: (c) =>
        set((state) => ({
          clues: [...state.clues, { ...c, id: nanoid(), isReleased: false }],
        })),

      updateClue: (id, data) =>
        set((state) => ({
          clues: state.clues.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteClue: (id) =>
        set((state) => ({
          clues: state.clues.filter((c) => c.id !== id),
        })),

      setMode: (mode) => set({ currentMode: mode }),

      setCreatorTab: (tab) => set({ creatorActiveTab: tab }),

      startGame: () =>
        set({
          gameState: {
            currentRound: 1,
            releasedClueIds: [],
            startedAt: Date.now(),
          },
          clues: get().clues.map((c) => ({ ...c, isReleased: false })),
        }),

      nextRound: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentRound: state.gameState.currentRound + 1,
          },
        })),

      prevRound: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentRound: Math.max(1, state.gameState.currentRound - 1),
          },
        })),

      releaseClue: (clueId) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            releasedClueIds: [...state.gameState.releasedClueIds, clueId],
          },
          clues: state.clues.map((c) =>
            c.id === clueId
              ? {
                  ...c,
                  isReleased: true,
                  releasedAt: Date.now(),
                  releasedInRound: state.gameState.currentRound,
                }
              : c
          ),
        })),

      resetGame: () =>
        set({
          gameState: {
            currentRound: 1,
            releasedClueIds: [],
          },
          clues: get().clues.map((c) => ({
            ...c,
            isReleased: false,
            releasedAt: undefined,
            releasedInRound: undefined,
          })),
        }),

      exportScript: () => {
        const state = get();
        return JSON.stringify(
          {
            script: state.script,
            characters: state.characters,
            scenes: state.scenes,
            items: state.items,
            timeline: state.timeline,
            clues: state.clues,
          },
          null,
          2
        );
      },

      importScript: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            script: data.script,
            characters: data.characters || [],
            scenes: data.scenes || [],
            items: data.items || [],
            timeline: data.timeline || [],
            clues: data.clues || [],
          });
        } catch (e) {
          console.error('Import failed:', e);
        }
      },
    }),
    {
      name: 'script-editor-state',
    }
  )
);

export function isClueAvailable(clue: Clue, gameState: GameState): boolean {
  if (clue.isReleased) return false;
  switch (clue.condition.type) {
    case 'round':
      return gameState.currentRound >= (clue.condition.round ?? 1);
    case 'scene':
      return true;
    case 'item':
      return true;
    default:
      return gameState.currentRound >= 1;
  }
}
