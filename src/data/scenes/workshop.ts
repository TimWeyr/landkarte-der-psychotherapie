import { Scene } from '../../types';

export const workshopScene: Scene = {
  id: 'scene_workshop',
  locationId: 'loc_workshop',
  title: 'Werkstatt der Erprobung',
  subtitle: 'Handlungsorientiertes Arbeiten, Übungen & Klärung der Zusammenarbeit',
  imageSrc: '/assets/scenes/workshop.svg',
  ambientTone: 'warm-amber',
  hotspots: [
    {
      id: 'ws_workbench',
      title: 'Die Werkbank der praktischen Schritte',
      subtitle: 'Schulenübergreifende Übungen & Experimente',
      xPercent: 48,
      yPercent: 68,
      icon: 'sparkles',
      zIndex: 10,
      dialogue: {
        speaker: 'Werkbank der Erprobung',
        speakerRole: 'Praktische Schauplatz-Übersicht',
        text: 'In vielen psychotherapeutischen Richtungen geht es nicht nur um das Reden über Probleme, sondern um das konkrete Ausprobieren neuer Schritte. KVT nutzt Verhaltensexperimente im Alltag, Gestalttherapie lässt innere Anteile auf Stühlen in Dialog treten, und die systemische Therapie vergibt Beobachtungsaufgaben.',
        claimIds: ['claim_action_oriented_rumination', 'claim_fit_collaboration_dynamic'],
        subtext: 'Konkrete Übungen helfen, festgefahrene Denkschleifen durch reale neue Erfahrungen zu durchbrechen.',
        subtextClaimIds: ['claim_action_oriented_rumination'],
        actions: [
          {
            id: 'bm_initial_interview_question_action',
            type: 'BOOKMARK',
            label: 'Als Frage für mein Erstgespräch merken: Handlungsorientiertes Arbeiten',
            description: '„Wie arbeiten Sie typischerweise mit konkreten Übungen oder Aufgaben – und wie prüfen wir gemeinsam, ob das für mich hilfreich ist und passen es bei Bedarf an?“',
            claimIds: ['claim_fit_collaboration_dynamic']
          },
          {
            id: 'act_ws_interest_action',
            type: 'INTEREST',
            label: 'Das interessiert mich: Schulenübergreifendes handlungsorientiertes Arbeiten',
            description: 'Du hast vermerkt, dass dich konkrete Übungen und handlungsorientierte Experimente interessieren.',
            claimIds: ['claim_action_oriented_rumination']
          },
          {
            id: 'act_ws_item_notepad',
            type: 'ITEM',
            label: 'Fundstück einstecken: Notizblock der Erprobung',
            description: 'Ein handlicher Block für Beobachtungen und kleine Alltagsexperimente.',
            item: {
              itemId: 'item_notepad_action',
              title: 'Notizblock der Erprobung',
              description: 'Symbolisiert die Bereitschaft, neue Handlungsschritte auszuprobieren und deren Wirkung im Alltag zu beobachten.',
              icon: 'clipboard-list',
              claimIds: ['claim_action_oriented_rumination']
            }
          }
        ]
      }
    },
    {
      id: 'ws_collaboration_desk',
      title: 'Das Notizbuch der Zusammenarbeit',
      subtitle: 'Reale Passung & therapeutisches Arbeitsbündnis',
      xPercent: 78,
      yPercent: 42,
      icon: 'user',
      zIndex: 10,
      dialogue: {
        speaker: 'Notizen zur therapeutischen Allianz',
        speakerRole: 'Orientierungsleitfaden',
        text: '„Passung ist keine vorab berechenbare Eigenschaft einer Therapieschule. Ob eine Zusammenarbeit funktioniert, zeigt sich im konkreten Gespräch: Fühle ich mich verstanden? Werden meine Ziele ernst genommen? Kann ich offen ansprechen, wenn eine Übung nicht passt?“',
        claimIds: ['claim_fit_collaboration_dynamic', 'claim_therapeutic_alliance'],
        subtext: 'Die therapeutische Beziehung entsteht im gemeinsamen Tun und darf aktiv mitgestaltet werden.',
        subtextClaimIds: ['claim_therapeutic_alliance'],
        actions: [
          {
            id: 'act_ws_about_me_flexibility',
            type: 'ABOUT_ME',
            label: 'Das beschreibt etwas von mir: Mir ist flexible Abstimmung wichtig',
            description: 'Du hast für dich notiert, dass dir eine partnerschaftliche Absprache und regelmäßige Rückmeldung im Gespräch Orientierung gibt.',
            claimIds: ['claim_fit_collaboration_dynamic']
          },
          {
            id: 'act_ws_interest_alliance',
            type: 'INTEREST',
            label: 'Das interessiert mich: Das therapeutische Arbeitsbündnis als Wirkfaktor',
            description: 'Du interessierst dich für die wissenschaftlichen Befunde zur Bedeutung der therapeutischen Beziehung.',
            claimIds: ['claim_therapeutic_alliance']
          }
        ]
      }
    }
  ]
};
