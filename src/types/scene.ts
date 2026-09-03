export type ActionType = 'INFO' | 'INTEREST' | 'ABOUT_ME' | 'BOOKMARK' | 'QUIZ' | 'ITEM' | 'NAVIGATE_ROUTES';

export interface QuizPayload {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationClaimIds?: string[];
}

export interface ItemPayload {
  itemId: string;
  title: string;
  description: string;
  icon: string;
  claimIds?: string[];
}

export interface BaseHotspotAction {
  id: string;
  label: string;
  description?: string;
  claimIds?: string[];
}

export interface InfoAction extends BaseHotspotAction {
  type: 'INFO';
}

export interface InterestAction extends BaseHotspotAction {
  type: 'INTEREST';
}

export interface AboutMeAction extends BaseHotspotAction {
  type: 'ABOUT_ME';
}

export interface BookmarkAction extends BaseHotspotAction {
  type: 'BOOKMARK';
}

export interface QuizAction extends BaseHotspotAction {
  type: 'QUIZ';
  quiz: QuizPayload;
}

export interface ItemAction extends BaseHotspotAction {
  type: 'ITEM';
  item: ItemPayload;
}

export interface NavigateRoutesAction extends BaseHotspotAction {
  type: 'NAVIGATE_ROUTES';
  routeId: string; // Verpflichtende Referenz auf src/data/exploration/routes.ts
}

export type HotspotAction =
  | InfoAction
  | InterestAction
  | AboutMeAction
  | BookmarkAction
  | QuizAction
  | ItemAction
  | NavigateRoutesAction;

export interface Condition {
  type: 'VISITED' | 'ITEM_COLLECTED' | 'QUIZ_SOLVED';
  targetId: string;
}

export interface HotspotDialogue {
  speaker?: string;
  speakerRole?: string;
  text: string;
  claimIds?: string[];
  subtext?: string;
  subtextClaimIds?: string[];
  actions: HotspotAction[];
}

export interface Hotspot {
  id: string;
  title: string;
  subtitle?: string;
  xPercent: number; // 0..100 relative position inside scene
  yPercent: number; // 0..100 relative position inside scene
  widthPercent?: number;
  heightPercent?: number;
  icon: string;
  zIndex?: number;
  conditions?: Condition[];
  dialogue: HotspotDialogue;
}

export interface Scene {
  id: string;
  locationId: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  ambientTone?: string;
  hotspots: Hotspot[];
}
