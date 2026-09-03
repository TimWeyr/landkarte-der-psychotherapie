export interface AtlasRoute {
  id: string;
  name: string;
  focus: string;
  color: string;
  locationIds: string[];
}

export const ATLAS_ROUTES: AtlasRoute[] = [
  {
    id: 'opt_concrete_action',
    name: '1. Konkrete Strategien erproben',
    focus: 'Praktisches Handeln, Verhaltensexperimente, Zielklärung und Stärkennutzung.',
    color: '#c68a35',
    locationIds: [
      'loc_workshop',
      'loc_thought_lab',
      'loc_courage_trail',
      'loc_goal_foundry',
      'loc_progress_observatory',
      'loc_resource_grove'
    ]
  },
  {
    id: 'opt_deep_patterns',
    name: '2. Tiefere Muster verstehen',
    focus: 'Biografie, Bindungsmuster, innere Stimmen und Erklärungsmodelle.',
    color: '#b25838',
    locationIds: [
      'loc_mask_market',
      'loc_life_archive',
      'loc_echo_cave',
      'loc_parts_house',
      'loc_rationale_cartography',
      'loc_self_compassion_garden'
    ]
  },
  {
    id: 'opt_thought_distance',
    name: '3. Gedankenabstand gewinnen',
    focus: 'Achtsamkeit, Defusion, Werteorientierung und Metakognition.',
    color: '#446473',
    locationIds: [
      'loc_thought_windmill',
      'loc_mindfulness_pavilion',
      'loc_values_observatory',
      'loc_thought_lab'
    ]
  },
  {
    id: 'opt_body_emotion',
    name: '4. Körper & Gefühle einbeziehen',
    focus: 'Affektregulation, Beruhigung, Somatik und Stabilisierung.',
    color: '#50755a',
    locationIds: [
      'loc_alarm_cliffs',
      'loc_stillwater_lake',
      'loc_safety_house',
      'loc_body_observatory',
      'loc_emotion_studio',
      'loc_fog_marsh'
    ]
  },
  {
    id: 'opt_social_context',
    name: '5. Beziehungen & Umfeld betrachten',
    focus: 'Grenzen, Bündnis, Reparatur, Familie und Gruppenerfahrung.',
    color: '#8c7765',
    locationIds: [
      'loc_boundary_bridge',
      'loc_closeness_distance_passage',
      'loc_alliance_bridge',
      'loc_repair_dock',
      'loc_perspective_square',
      'loc_network_courtyard',
      'loc_group_campfire'
    ]
  },
  {
    id: 'route_care_orientation',
    name: '6. Der Versorgungsweg',
    focus: 'Erste Schritte im Gesundheitssystem, Rechte, Verlauf und Notfallhilfe.',
    color: '#2d261e',
    locationIds: [
      'loc_station',
      'loc_methods_library',
      'loc_goal_foundry',
      'loc_progress_observatory',
      'loc_second_opinion_house'
    ]
  }
];

export function getAtlasRouteById(id: string): AtlasRoute | undefined {
  return ATLAS_ROUTES.find(r => r.id === id);
}
