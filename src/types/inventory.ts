export interface ArtifactEntry {
  id: string;
  title: string;
  description: string;
  icon: string;
  originSceneId: string;
  originSceneTitle: string;
  timestamp: number;
}

export interface InterestEntry {
  id: string;
  title: string;
  note: string;
  originSceneId: string;
  originSceneTitle: string;
  timestamp: number;
}

export interface AboutMeEntry {
  id: string;
  statement: string;
  originSceneId: string;
  originSceneTitle: string;
  timestamp: number;
}

export interface BookmarkEntry {
  id: string;
  title: string;
  summary: string;
  originSceneId: string;
  originSceneTitle: string;
  timestamp: number;
}
