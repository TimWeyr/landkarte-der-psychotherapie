import { Scene } from '../../types';

/**
 * SCENE TEMPLATE: Use this template to add any new scene (e.g. Scene C, Scene D)
 * to the Psychotherapie-Landkarte without modifying any core engine or UI code!
 *
 * Steps to activate a new scene:
 * 1. Duplicate this file and name it e.g. `src/data/scenes/mindfulness_park.ts`.
 * 2. Put your background image into `public/assets/scenes/your_scene.jpg`.
 * 3. Fill in hotspots with coordinates (in %), dialogues, and actions.
 * 4. Register the scene in `src/data/scenes/index.ts`.
 * 5. Add or link a `LocationNode` with `sceneId` in `src/data/worldData.ts`.
 */
export const templateScene: Scene = {
  id: 'scene_template_example',
  locationId: 'loc_template_example',
  title: 'Beispiel-Szene C (Template)',
  subtitle: 'Vorlage zur einfachen Erweiterung um neue Schauplätze',
  imageSrc: '/assets/scenes/lighthouse.jpg', // Replace with your image
  ambientTone: 'sage',
  hotspots: [
    {
      id: 'tpl_hotspot_1',
      title: 'Beispiel-Wegweiser',
      subtitle: 'Erkundung',
      xPercent: 50,
      yPercent: 50,
      icon: 'compass',
      zIndex: 10,
      dialogue: {
        speaker: 'Wegweiser',
        speakerRole: 'Orientierung',
        text: 'Dies ist ein Beispiel-Hotspot. Neue Szenen können beliebig viele Hotspots und Aktionen besitzen.',
        actions: [
          {
            id: 'act_tpl_interest',
            type: 'INTEREST',
            label: 'Das interessiert mich: Neues Thema erforschen',
            description: 'Beispiel-Notiz für den Rucksack.'
          },
          {
            id: 'act_tpl_bookmark',
            type: 'BOOKMARK',
            label: 'Für später merken: Template-Wissen',
            description: 'Gespeicherter Lesezeichen-Eintrag.'
          }
        ]
      }
    }
  ]
};
