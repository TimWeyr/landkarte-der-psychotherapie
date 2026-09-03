import { WorldMapData } from '../types';

export const WORLD_DATA: WorldMapData = {
  id: 'world_central_v01',
  title: 'Zentralregion der Orientierung',
  imageSrc: '/assets/map/central_region.jpg',
  nativeWidth: 1920,
  nativeHeight: 1080,
  regions: [
    {
      id: 'reg_central',
      name: 'Zentralregion der Orientierung',
      description: 'Der Einstiegsbereich für grundlegende Orientierung, Evidenz und das Versorgungssystem.',
      color: '#d4af37'
    },
    {
      id: 'reg_behavioral',
      name: 'Ebene des Handelns (KVT)',
      description: 'Bereich der konkreten Verhaltensanalysen und kognitiven Methoden.',
      color: '#4a7c8e'
    },
    {
      id: 'reg_depth',
      name: 'Tal der Tiefe (Psychodynamik)',
      description: 'Bereich der unbewussten Konflikte, Bindungen und lebensgeschichtlichen Muster.',
      color: '#6a4f9b'
    },
    {
      id: 'reg_systemic',
      name: 'Netzwerk-Archipel (Systemik)',
      description: 'Bereich der sozialen Beziehungen, Rollen und familiären Kontexte.',
      color: '#468058'
    }
  ],
  locations: [
    {
      id: 'loc_lighthouse',
      name: 'Leuchtturm der Evidenz',
      regionId: 'reg_central',
      type: 'scene',
      sceneId: 'scene_lighthouse',
      xPercent: 18.5,
      yPercent: 62.0,
      icon: 'lighthouse',
      badgeText: 'Begehbar',
      tagline: 'Wissensarten & Orientierungskompass',
      knowledgeNodeIds: [
        'node_collab_therapeutic_alliance',
        'node_exp_constant_rumination'
      ]
    },
    {
      id: 'loc_station',
      name: 'Bahnhof der Versorgung',
      regionId: 'reg_central',
      type: 'scene',
      sceneId: 'scene_station',
      xPercent: 52.0,
      yPercent: 44.0,
      icon: 'train',
      badgeText: 'Begehbar',
      tagline: 'Sprechstunde & Wege zur Kostenübernahme',
      knowledgeNodeIds: [
        'node_care_consultation_116117',
        'node_care_funding_paths',
        'node_need_orientation_clarity'
      ]
    },
    {
      id: 'loc_workshop',
      name: 'Werkstatt der Erprobung',
      regionId: 'reg_central',
      type: 'scene',
      sceneId: 'scene_workshop',
      xPercent: 36.0,
      yPercent: 52.0,
      icon: 'hammer',
      badgeText: 'Begehbar',
      tagline: 'Handlungsorientierte Schritte & Passungsprüfung',
      knowledgeNodeIds: [
        'node_wm_concrete_action',
        'node_proc_behavioral_activation',
        'node_tech_behavioral_experiment',
        'node_tech_chair_work',
        'node_tech_systemic_tasks',
        'node_collab_fit_examination'
      ]
    },
    {
      id: 'loc_teaser_cbt',
      name: 'Plateau der Kognitiven Verhaltenstherapie',
      regionId: 'reg_behavioral',
      type: 'teaser',
      xPercent: 78.0,
      yPercent: 28.0,
      icon: 'brain',
      badgeText: 'In Entwicklung',
      tagline: 'Gedanken, Verhalten & Erprobung',
      teaserText: 'Hier entsteht der Schauplatz für kognitive Umstrukturierung, Verhaltensanalysen und Exposition.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_cbt']
    },
    {
      id: 'loc_teaser_psychoanalysis',
      name: 'Schlucht der Tiefenpsychologie',
      regionId: 'reg_depth',
      type: 'teaser',
      xPercent: 82.0,
      yPercent: 68.0,
      icon: 'mountain',
      badgeText: 'In Entwicklung',
      tagline: 'Biografie, Übertragung & Unbewusstes',
      teaserText: 'Hier entsteht der Schauplatz für psychodynamische Konflikte, freie Assoziation und Biografiearbeit.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_psychodynamic']
    },
    {
      id: 'loc_teaser_systemic',
      name: 'Lichtung der Systemischen Therapie',
      regionId: 'reg_systemic',
      type: 'teaser',
      xPercent: 44.0,
      yPercent: 82.0,
      icon: 'tree-pine',
      badgeText: 'In Entwicklung',
      tagline: 'Beziehungen, Muster & Ressourcen',
      teaserText: 'Hier entsteht der Schauplatz für Genogrammarbeit, zirkuläres Fragen und familiäre Dynamiken.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_systemic']
    },
    {
      id: 'loc_teaser_humanistic',
      name: 'Garten der Humanistischen Verfahren',
      regionId: 'reg_central',
      type: 'teaser',
      xPercent: 12.0,
      yPercent: 34.0,
      icon: 'flower',
      badgeText: 'In Entwicklung',
      tagline: 'Selbstentfaltung, Kontakt & Gestaltarbeit',
      teaserText: 'Hier entsteht der Schauplatz für Gestalttherapie, Gesprächspsychotherapie und Emotionsfokussierung.',
      teaserClaimIds: ['claim_fit_collaboration_dynamic']
    }
  ]
};
