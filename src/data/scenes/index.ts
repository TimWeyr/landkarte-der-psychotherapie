import { Scene } from '../../types';
import { lighthouseScene } from './lighthouse';
import { stationScene } from './station';
import { workshopScene } from './workshop';

export const SCENES_REGISTRY: Record<string, Scene> = {
  [lighthouseScene.id]: lighthouseScene,
  [stationScene.id]: stationScene,
  [workshopScene.id]: workshopScene
};

export function getSceneById(id: string): Scene | undefined {
  return SCENES_REGISTRY[id];
}
