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
        subtext: 'Wissenschaftliche Evidenz hilft, wirksame Wege von bloßen Behauptungen zu unterscheiden.',
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
      subtitle: 'Systematische Wirksamkeitsforschung',
      xPercent: 57,
      yPercent: 26,
      icon: 'file-text',
      zIndex: 10,
      dialogue: {
        speaker: 'Forschungstafel',
        speakerRole: 'Wissenschaftliche Übersicht',
        text: 'In Deutschland sind Richtlinienverfahren (z. B. Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie und Systemische Therapie) durch den Gemeinsamen Bundesausschuss (G-BA) auf ihre wissenschaftliche Wirksamkeit hin geprüft und anerkannt.',
        claimIds: ['claim_gba_guidelines'],
        subtext: 'Evidenzbasierung schützt Patientinnen und Patienten vor unwirksamen oder schädlichen Methoden.',
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
      subtitle: 'Gespräch & Reflexion',
      xPercent: 86,
      yPercent: 70,
      icon: 'user',
      zIndex: 10,
      dialogue: {
        speaker: 'Leuchtturmwärter Paul',
        speakerRole: 'Orientierungsgeber',
        text: '„Willkommen, Reisender. Viele Menschen fühlen sich vom Dschungel der Therapiebegriffe überwältigt. Mein Rat: Achte darauf, ob ein Ansatz methodisch abgesichert ist, aber vergiss nie, dass auch die persönliche Beziehung zu deiner Therapeutin oder deinem Therapeuten ein entscheidender Wirkfaktor ist.“',
        claimIds: ['claim_therapeutic_alliance'],
        subtext: 'Studiendaten geben die Leitplanken – die therapeutische Allianz füllt sie mit Leben.',
        subtextClaimIds: ['claim_therapeutic_alliance'],
        actions: [
          {
            id: 'act_lh_about_me_safety',
            type: 'ABOUT_ME',
            label: 'Das beschreibt etwas von mir: Ich lege Wert auf wissenschaftliche Absicherung',
            description: 'Du hast für dich vermerkt, dass dir transparente und fundierte Methoden Orientierung geben.',
            claimIds: ['claim_evidence_perspectives']
          },
          {
            id: 'act_lh_interest_alliance',
            type: 'INTEREST',
            label: 'Das interessiert mich: Die therapeutische Beziehung als Wirkfaktor',
            description: 'Du interessierst dich für die Rolle der zwischenmenschlichen Passung in der Therapie.',
            claimIds: ['claim_therapeutic_alliance']
          }
        ]
      }
    }
  ]
};
