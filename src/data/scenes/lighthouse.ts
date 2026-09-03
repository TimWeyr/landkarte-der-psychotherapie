import { Scene } from '../../types';

export const lighthouseScene: Scene = {
  id: 'scene_lighthouse',
  locationId: 'loc_lighthouse',
  title: 'Leuchtturm der Evidenz',
  subtitle: 'Wissensarten, wissenschaftliche Fundierung & Orientierung',
  imageSrc: '/assets/scenes/lighthouse.jpg',
  ambientTone: 'amber',
  hotspots: [
    {
      id: 'lh_compass_desk',
      title: 'Der Kompasstisch der Erkundung',
      subtitle: 'Ausgangspunkt für eigene Fragen & Arbeitsweisen',
      xPercent: 32,
      yPercent: 74,
      icon: 'map',
      zIndex: 15,
      dialogue: {
        speaker: 'Kartentisch des Leuchtturms',
        speakerRole: 'Orientierungskompass',
        text: '„Fühlst du dich von ständigen Gedankenschleifen überfordert? Auf diesem Kompasstisch kannst du erkunden, wie unterschiedliche psychotherapeutische Arbeitsweisen an solche Erlebensweisen herangehen.“',
        claimIds: ['claim_action_oriented_rumination', 'claim_fit_collaboration_dynamic'],
        subtext: 'Wähle eine Erkundungsperspektive, um thematisch passende Schauplätze auf der Landkarte hervorzuheben.',
        subtextClaimIds: ['claim_fit_collaboration_dynamic'],
        actions: [
          {
            id: 'act_lh_open_compass',
            type: 'NAVIGATE_ROUTES',
            label: '🧭 Kompass öffnen: „Ich kann nicht abschalten und grüble ständig.“',
            description: 'Erkunde 5 gleichwertige Arbeitsweisen und Vorbereitungsfragen für Erstgespräche.',
            routeId: 'route_rumination_perspectives',
            claimIds: ['claim_fit_collaboration_dynamic']
          }
        ]
      }
    },
    {
      id: 'lh_telescope',
      title: 'Das Fernrohr der Perspektiven',
      subtitle: 'Fokus & Weitsicht',
      xPercent: 18,
      yPercent: 62,
      icon: 'telescope',
      zIndex: 10,
      dialogue: {
        speaker: 'Beobachtungsplatz',
        speakerRole: 'Optisches Instrument',
        text: 'Durch dieses Messingfernrohr blickt man weit über das Meer der Psychotherapie. Es erinnert daran, dass verschiedene Perspektiven – empirische Forschung, fundierte Theorie und persönliche Erfahrung – erst zusammen ein klares Gesamtbild ergeben.',
        claimIds: ['claim_evidence_perspectives'],
        subtext: 'Wissenschaftliche Evidenz hilft, fundierte Wege von bloßen Behauptungen zu unterscheiden.',
        subtextClaimIds: ['claim_evidence_perspectives'],
        actions: [
          {
            id: 'act_lh_item_lens',
            type: 'ITEM',
            label: 'Fundstück einstecken: Linse der Differenzierung',
            description: 'Ein optisches Glas, das hilft, Studienwissen und Alltagsmeinung zu trennen.',
            claimIds: ['claim_evidence_perspectives'],
            item: {
              itemId: 'item_lens_differentiation',
              title: 'Linse der Differenzierung',
              description: 'Symbolisiert die Fähigkeit, zwischen geprüfter wissenschaftlicher Evidenz und subjektiven Heilsversprechen zu unterscheiden.',
              icon: 'eye',
              claimIds: ['claim_evidence_perspectives']
            }
          },
          {
            id: 'act_lh_bookmark_perspectives',
            type: 'BOOKMARK',
            label: 'Für später merken: Die drei Wissensebenen',
            description: 'Merkt sich die Unterscheidung zwischen Studien, Theorie und Praxis.',
            claimIds: ['claim_evidence_perspectives']
          }
        ]
      }
    },
    {
      id: 'lh_wall_charts',
      title: 'Die Studientafel',
      subtitle: 'Richtlinienverfahren & Versorgungsrahmen',
      xPercent: 57,
      yPercent: 26,
      icon: 'file-text',
      zIndex: 10,
      dialogue: {
        speaker: 'Forschungstafel',
        speakerRole: 'Wissenschaftliche Übersicht',
        text: 'Der Gemeinsame Bundesausschuss (G-BA) legt als Selbstverwaltungsorgan fest, welche psychotherapeutischen Behandlungsverfahren von den gesetzlichen Krankenkassen erstattet werden (Richtlinienverfahren: Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie und systemische Therapie). Dieser sozialrechtliche Zulassungsstatus regelt den Leistungsanspruch im deutschen Kassensystem, stellt jedoch keine vergleichende Rangfolge oder qualitative Überlegenheitsaussage therapeutischer Traditionen dar.',
        claimIds: ['claim_gba_guidelines'],
        subtext: 'Die Psychotherapie-Richtlinie definiert den formalen Rahmen der Leistungsübernahme durch die gesetzliche Krankenversicherung.',
        subtextClaimIds: ['claim_gba_guidelines'],
        actions: [
          {
            id: 'act_lh_interest_evidence',
            type: 'INTEREST',
            label: 'Das interessiert mich: Wissenschaftlich fundierte Richtlinienverfahren',
            description: 'Du hast markiert, dass dich evidenzbasierte Richtlinienverfahren interessieren.',
            claimIds: ['claim_gba_guidelines']
          },
          {
            id: 'act_lh_bookmark_g_ba',
            type: 'BOOKMARK',
            label: 'Für später merken: G-BA Richtlinienverfahren',
            description: 'Notiz zu den anerkannten Psychotherapieverfahren in Deutschland.',
            claimIds: ['claim_gba_guidelines']
          }
        ]
      }
    },
    {
      id: 'lh_logbook',
      title: 'Logbuch des Wärters',
      subtitle: 'Kleine Wissensüberprüfung',
      xPercent: 66,
      yPercent: 56,
      icon: 'book-open',
      zIndex: 10,
      dialogue: {
        speaker: 'Offenes Logbuch',
        speakerRole: 'Wissenscheck',
        text: 'Im Logbuch sind Beobachtungen zur wissenschaftlichen Methodik festgehalten. Kannst du die zentrale Frage des Leuchtturmwärters beantworten?',
        claimIds: ['claim_evidence_perspectives'],
        actions: [
          {
            id: 'act_lh_quiz_evidence',
            type: 'QUIZ',
            label: 'Wissensfrage lösen: Was bedeutet „Evidenz“?',
            claimIds: ['claim_evidence_perspectives'],
            quiz: {
              question: 'Was versteht man in der modernen Psychotherapie unter einem „evidenzbasierten Verfahren“?',
              options: [
                'Ein Verfahren, das auf jahrhundertealter Tradition beruht, ohne experimentelle Studien zu benötigen.',
                'Ein Verfahren, dessen Wirksamkeit in methodisch kontrollierten wissenschaftlichen Studien nachgewiesen wurde.',
                'Ein Verfahren, das ausschließlich von privaten Instituten ohne staatliche Vorgaben zertifiziert wird.'
              ],
              correctIndex: 1,
              explanation: 'Richtig! Evidenzbasierung bedeutet, dass systematische klinische Studien (z. B. randomisierte kontrollierte Studien) die Wirksamkeit bei bestimmten Beschwerdebildern belegen.',
              explanationClaimIds: ['claim_evidence_perspectives']
            }
          }
        ]
      }
    },
    {
      id: 'lh_keeper',
      title: 'Der Leuchtturmwärter',
      subtitle: 'Therapeutische Allianz als Wirkfaktor',
      xPercent: 82,
      yPercent: 70,
      icon: 'user',
      zIndex: 10,
      dialogue: {
        speaker: 'Leuchtturmwärter',
        speakerRole: 'Erfahrener Wegbegleiter',
        text: '„Verfahren und Techniken sind das Handwerkszeug. Doch die Forschung zeigt unmissverständlich: Ob eine Psychotherapie hilft, hängt maßgeblich von einer vertrauensvollen Beziehung zwischen Patient und Therapeut ab.“',
        claimIds: ['claim_therapeutic_alliance'],
        subtext: 'Zahlreiche Metaanalysen belegen, dass die therapeutische Beziehung ein schulenübergreifender Hauptwirkfaktor ist.',
        subtextClaimIds: ['claim_therapeutic_alliance'],
        actions: [
          {
            id: 'act_lh_interest_alliance',
            type: 'INTEREST',
            label: 'Das interessiert mich: Die therapeutische Allianz als Wirkfaktor',
            description: 'Du hast dir gemerkt, dass die Qualität der therapeutischen Beziehung eine zentrale Rolle spielt.',
            claimIds: ['claim_therapeutic_alliance']
          },
          {
            id: 'act_lh_about_me_alliance',
            type: 'ABOUT_ME',
            label: 'Das beschreibt etwas von mir: Mir ist eine vertrauensvolle Beziehung besonders wichtig',
            description: 'Du hast für dich festgehalten, dass ein gutes Bauchgefühl und gegenseitiges Vertrauen für dich zentral sind.',
            claimIds: ['claim_therapeutic_alliance']
          }
        ]
      }
    }
  ]
};
