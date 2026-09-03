export interface LocationNode {
  id: string;
  name: string;
  tagline: string;
  type: 'scene' | 'teaser';
  xPercent: number; // 0..100 on the world map
  yPercent: number; // 0..100 on the world map
  icon: string; // Lucide icon name or SVG path
  regionId: string;
  sceneId?: string; // Target scene ID if type === 'scene'
  badgeText?: string;
  teaserText?: string; // Info for future areas
  knowledgeNodeIds?: string[]; // Kanonische Verknüpfung: Repräsentierte Fachknoten
  teaserClaimIds?: string[];   // Beleg für fachliche Aussagen im Teasertext
}

export interface Region {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface WorldMapData {
  id: string;
  title: string;
  imageSrc: string;
  nativeWidth: number;
  nativeHeight: number;
  regions: Region[];
  locations: LocationNode[];
}
