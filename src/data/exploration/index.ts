import { ExplorationRoute } from '../../types';
import { EXPLORATION_ROUTES } from './routes';

export * from './routes';

export function getExplorationRouteById(id: string): ExplorationRoute | undefined {
  return EXPLORATION_ROUTES.find(r => r.id === id);
}

export function getRoutesForTriggerNode(triggerNodeId: string): ExplorationRoute[] {
  return EXPLORATION_ROUTES.filter(r => r.triggerNodeId === triggerNodeId);
}
