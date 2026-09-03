import { WorldMapData } from '../types';

export const WORLD_DATA: WorldMapData = {
  id: 'world_central_region',
  title: 'Zentralregion: Das Tal der Orientierung',
  imageSrc: '/assets/map/central_region.jpg',
  nativeWidth: 1792,
  nativeHeight: 1024,
  regions: [
    {
      id: 'reg_coastal_evidence',
      name: 'Küste der Grundlagen & Evidenz',
      description: 'Hier stehen die Wegweiser und Leuchttürme für wissenschaftlich gesicherte Methoden.',
      color: '#4a7c8e'
    },
    {
      id: 'reg_valley_station',
      name: 'Tal der Versorgung & Wege',
      description: 'Der zentrale Knotenpunkt für Fahrpläne, Sprechstunden und Versorgungsrealität.',
      color: '#b2733b'
    },
    {
      id: 'reg_future_traditions',
      name: 'Pfade der Therapieschulen (in Entwicklung)',
      description: 'Andeutungen zukünftiger Schauplätze wie Verhaltenstherapie, Tiefenpsychologie und Systemische Ansätze.',
      color: '#5b8a5b'
    }
  ],
  locations: [
    {
      id: 'loc_lighthouse',
      name: 'Leuchtturm der Evidenz',
      tagline: 'Wissensarten & wissenschaftliche Fundierung',
      type: 'scene',
      sceneId: 'scene_lighthouse',
      xPercent: 21,
      yPercent: 28,
      icon: 'sparkles',
      regionId: 'reg_coastal_evidence',
      badgeText: 'Betretbar',
      knowledgeNodeIds: [
        'node_exp_constant_rumination',
        'node_collab_therapeutic_alliance',
        'node_wm_thought_distance'
      ]
    },
    {
      id: 'loc_station',
      name: 'Bahnhof der Versorgung',
      tagline: 'Sprechstunde, 116 117 & Erste Schritte',
      type: 'scene',
      sceneId: 'scene_station',
      xPercent: 55,
      yPercent: 73,
      icon: 'navigation',
      regionId: 'reg_valley_station',
      badgeText: 'Betretbar',
      knowledgeNodeIds: [
        'node_care_consultation_116117',
        'node_care_funding_paths'
      ]
    },
    {
      id: 'loc_workshop',
      name: 'Werkstatt der Erprobung',
      tagline: 'Handlungsorientierte Übungen & gemeinsame Passung',
      type: 'scene',
      sceneId: 'scene_workshop',
      xPercent: 44,
      yPercent: 42,
      icon: 'compass',
      regionId: 'reg_coastal_evidence',
      badgeText: 'Betretbar',
      knowledgeNodeIds: [
        'node_wm_concrete_action',
        'node_tech_behavioral_experiment',
        'node_tech_chair_work',
        'node_collab_fit_examination'
      ]
    },
    {
      id: 'loc_teaser_cbt',
      name: 'Dorf der Verhaltenstherapie',
      tagline: 'Gedankenmuster, Exposition & konkrete Übungen',
      type: 'teaser',
      xPercent: 68,
      yPercent: 38,
      icon: 'home',
      regionId: 'reg_future_traditions',
      badgeText: 'In Vorbereitung (V0.2)',
      teaserText: 'Im Dorf der Verhaltenstherapie (KVT) erforschst du, wie Gedanken, Gefühle und Handlungen zusammenhängen und wie erlernte Muster schrittweise verändert werden können.',
      knowledgeNodeIds: [
        'node_app_cbt',
        'node_tech_behavioral_experiment'
      ],
      teaserClaimIds: ['claim_gba_guidelines']
    },
    {
      id: 'loc_teaser_psychoanalysis',
      name: 'Gipfel der Tiefenpsychologie',
      tagline: 'Unbewusstes, Konflikte & biografische Wurzeln',
      type: 'teaser',
      xPercent: 84,
      yPercent: 16,
      icon: 'mountain',
      regionId: 'reg_future_traditions',
      badgeText: 'In Vorbereitung (V0.2)',
      teaserText: 'Auf den Höhen der Tiefenpsychologie und Psychoanalyse blickt man in die Tiefe biografischer Prägungen, innerer Konflikte und unbewusster Beziehungsmuster.',
      knowledgeNodeIds: [
        'node_app_psychodynamic',
        'node_wm_deep_patterns'
      ],
      teaserClaimIds: ['claim_gba_guidelines']
    },
    {
      id: 'loc_teaser_systemic',
      name: 'Wald der Systemischen Pfade',
      tagline: 'Beziehungsnetze, Kontexte & Ressourcen',
      type: 'teaser',
      xPercent: 88,
      yPercent: 68,
      icon: 'trees',
      regionId: 'reg_future_traditions',
      badgeText: 'In Vorbereitung (V0.2)',
      teaserText: 'Im systemischen Wald steht der Mensch nicht isoliert da: Hier geht es um familiäre Muster, soziale Geflechte und die Entdeckung verborgener eigener Stärken.',
      knowledgeNodeIds: [
        'node_app_systemic',
        'node_wm_social_context'
      ],
      teaserClaimIds: ['claim_gba_guidelines']
    },
    {
      id: 'loc_teaser_humanistic',
      name: 'Bucht der Humanistischen Ansätze',
      tagline: 'Gesprächspsychotherapie, Gestalt & Selbstentfaltung',
      type: 'teaser',
      xPercent: 26,
      yPercent: 60,
      icon: 'sun',
      regionId: 'reg_future_traditions',
      badgeText: 'In Vorbereitung (V0.2)',
      teaserText: 'An dieser ruhigen Bucht stehen Empathie, Wertschätzung und das Vertrauen in die menschliche Wachstums- und Selbstheilungskraft im Mittelpunkt.',
      knowledgeNodeIds: [
        'node_app_humanistic',
        'node_wm_body_emotion'
      ]
    }
  ]
};
