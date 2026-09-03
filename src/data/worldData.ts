import { WorldMapData } from '../types';

export const WORLD_DATA: WorldMapData = {
  id: 'map_central_region',
  title: 'Landkarte der Psychotherapie – Zentralregion',
  imageSrc: '/assets/map/central_region.jpg',
  nativeWidth: 2048,
  nativeHeight: 1536,
  regions: [
    {
      id: 'reg_central',
      name: 'Zentralregion',
      description: 'Das Herzstück der Psychotherapielandschaft mit den Grundlagen der Evidenz und Versorgung.',
      color: '#c9933b'
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
        'node_exp_constant_rumination',
        'node_need_structure_coping',
        'node_wm_concrete_action'
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
      teaserText: 'Auf diesem Plateau wird erkundet, wie Gedankenmuster und Verhaltensweisen analysiert und verändert werden.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_cbt', 'node_proc_behavioral_activation', 'node_tech_behavioral_experiment']
    },
    {
      id: 'loc_teaser_psychoanalysis',
      name: 'Hain der Tiefenpsychologie',
      regionId: 'reg_depth',
      type: 'teaser',
      xPercent: 22.0,
      yPercent: 24.0,
      icon: 'tree-pine',
      badgeText: 'In Entwicklung',
      tagline: 'Unbewusstes, Biografie & Beziehungsmuster',
      teaserText: 'Im Hain der Tiefe werden lebensgeschichtliche Ursachen, unbewusste Konflikte und Bindungsmuster beleuchtet.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_psychodynamic', 'node_proc_schema_exploration']
    },
    {
      id: 'loc_teaser_systemic',
      name: 'Lichtung der Systemischen Therapie',
      regionId: 'reg_systemic',
      type: 'teaser',
      xPercent: 82.0,
      yPercent: 70.0,
      icon: 'network',
      badgeText: 'In Entwicklung',
      tagline: 'Muster im Umfeld, Rollen & Kommunikation',
      teaserText: 'Auf dieser Lichtung werden soziale Systeme, Beziehungsdynamiken und Mehrgenerationen-Perspektiven erkundet.',
      teaserClaimIds: ['claim_gba_guidelines'],
      knowledgeNodeIds: ['node_app_systemic', 'node_tech_systemic_tasks']
    },
    {
      id: 'loc_teaser_humanistic',
      name: 'Quelle der Humanistischen Verfahren',
      regionId: 'reg_central',
      type: 'teaser',
      xPercent: 44.0,
      yPercent: 80.0,
      icon: 'sparkles',
      badgeText: 'In Entwicklung',
      tagline: 'Erleben, Selbstentfaltung & Gestalttherapie',
      teaserText: 'An dieser Quelle stehen das unmittelbare emotionale Erleben im Hier und Jetzt und ganzheitliche Wachstumsprozesse im Mittelpunkt.',
      teaserClaimIds: ['claim_evidence_perspectives'],
      knowledgeNodeIds: ['node_app_humanistic', 'node_tech_chair_work']
    }
  ]
};
