export interface Script {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface Character {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  secretInfo: string;
  tags: string[];
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  relatedCharacterIds: string[];
  relatedItemIds: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  holderId?: string;
  sceneId?: string;
}

export interface TimelineEvent {
  id: string;
  round: number;
  title: string;
  description: string;
  sortOrder: number;
}

export type ConditionType = 'round' | 'scene' | 'item' | 'custom';

export interface ReleaseCondition {
  type: ConditionType;
  round?: number;
  sceneId?: string;
  itemId?: string;
  customDescription?: string;
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  image?: string;
  secretNotes: string;
  relatedCharacterIds: string[];
  relatedSceneIds: string[];
  relatedItemIds: string[];
  condition: ReleaseCondition;
  isReleased: boolean;
  releasedAt?: number;
  releasedInRound?: number;
}

export interface GameState {
  currentRound: number;
  releasedClueIds: string[];
  startedAt?: number;
}

export type CreatorTab =
  | 'characters'
  | 'scenes'
  | 'items'
  | 'timeline'
  | 'clues'
  | 'export';

export type AppMode = 'creator' | 'host';
