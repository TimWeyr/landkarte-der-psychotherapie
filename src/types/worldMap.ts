export interface MajorTherapeuticRegion {
  id: string;
  name: string;
  subtitle: string;
  landscapeDescription: string;
  xPercent: number;
  yPercent: number;
  badgeText: string;
  badgeColor: string;
  icon: string;
  isCentralRegion: boolean;
  
  // Didactic and theoretical content for the overview drawer
  corePhilosophy: string;
  historicalRoots: string;
  typicalWorkingModes: string[];
  whatItDoesNotClaim: string;
  futureSubLocations: string[];
}

export type NavigationLevel = 'world' | 'central_atlas' | 'scene';

export interface NavigationBreadcrumb {
  level: NavigationLevel;
  label: string;
  targetId?: string;
}
