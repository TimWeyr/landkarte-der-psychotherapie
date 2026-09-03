import { Scene } from '../../types';

export const stationScene: Scene = {
  id: 'scene_station',
  locationId: 'loc_station',
  title: 'Bahnhof der Versorgung',
  subtitle: 'Versorgungswege, Psychotherapeutische Sprechstunde & Erste Schritte',
  imageSrc: '/assets/scenes/station.jpg',
  ambientTone: 'warm-wood',
  hotspots: [
    {
      id: 'st_info_board',
      title: 'Die Informationstafel',
      subtitle: 'Der Erstkontakt: 116 117 & Sprechstunde',
      xPercent: 14,
      yPercent: 44,
      icon: 'clipboard-list',
      zIndex: 10,
      dialogue: {
        speaker: 'Aushang der Terminservicestelle',
        speakerRole: 'Offizielle Wegweisung',
        text: 'Seit der Strukturreform ist die „Psychotherapeutische Sprechstunde“ der verbindliche Einstieg. Hier erfolgt eine erste diagnostische Abklärung und Beratung. Einen zeitnahen Termin dafür vermittelt die Terminservicestelle der Kassenärztlichen Vereinigungen (Telefon 116 117 oder online).',
        claimIds: ['claim_care_116117_ptv11'],
        subtext: 'Wichtig: Ein Sprechstundentermin ist noch keine Zusage für einen festen Therapieplatz, liefert aber das wichtige Formular PTV 11.',
        subtextClaimIds: ['claim_care_116117_ptv11'],
        actions: [
          {
            id: 'act_st_item_ticket',
            type: 'ITEM',
            label: 'Fundstück einstecken: Fahrkarte zur Erstberatung',
            description: 'Ein Informationsblatt mit den wichtigsten Schritten zur 116 117 und Sprechstunde.',
            claimIds: ['claim_care_116117_ptv11'],
            item: {
              itemId: 'item_ticket_first_step',
              title: 'Fahrkarte zur Erstberatung',
              description: 'Enthält die Notiz: Telefonnummer 116 117 für den ersten Sprechstundentermin & Vermittlungscode auf dem PTV 11 Formular.',
              icon: 'ticket',
              claimIds: ['claim_care_116117_ptv11']
            }
          },
          {
            id: 'act_st_bookmark_116117',
            type: 'BOOKMARK',
            label: 'Für später merken: 116 117 & PTV 11 Leitfaden',
            description: 'Wegweiser zur Buchung einer Psychotherapeutischen Sprechstunde.',
            claimIds: ['claim_care_116117_ptv11']
          }
        ]
      }
    },
    {
      id: 'st_bench_waiting',
      title: 'Die Wartebank',
      subtitle: 'Umgang mit Wartezeiten & Überbrückung',
      xPercent: 18,
      yPercent: 78,
      icon: 'clock',
      zIndex: 10,
      dialogue: {
        speaker: 'Notiz auf der Wartebank',
        speakerRole: 'Praktischer Rat',
        text: 'Wartezeiten auf einen festen Therapieplatz können mehrere Monate betragen. Zur Überbrückung können psychosoziale Beratungsstellen (z. B. Diakonie, Caritas, Pro Familia), Krisendienste, Hausärzte oder ambulante Gruppenangebote wertvolle Halteseile bieten.',
        claimIds: ['claim_care_funding_paths'],
        subtext: 'Man muss die Wartezeit nicht alleine und unbegleitet verbringen.',
        subtextClaimIds: ['claim_care_funding_paths'],
        actions: [
          {
            id: 'act_st_about_me_waiting',
            type: 'ABOUT_ME',
            label: 'Das beschreibt etwas von mir: Ich suche Orientierung beim Thema Wartezeiten',
            description: 'Du hast notiert, dass für dich Wege zur Überbrückung von Wartezeiten relevant sind.',
            claimIds: ['claim_care_funding_paths']
          },
          {
            id: 'act_st_bookmark_bridging',
            type: 'BOOKMARK',
            label: 'Für später merken: Beratungsstellen & Krisendienste',
            description: 'Kostenfreie und niedrigschwellige Anlaufstellen zur Überbrückung.',
            claimIds: ['claim_care_funding_paths']
          }
        ]
      }
    },
    {
      id: 'st_departure_board',
      title: 'Der Abfahrtsplan',
      subtitle: 'Die drei Hauptversorgungswege',
      xPercent: 53,
      yPercent: 38,
      icon: 'map',
      zIndex: 10,
      dialogue: {
        speaker: 'Abfahrtstafel der Versorgungsrouten',
        speakerRole: 'Systematische Übersicht',
        text: 'In Deutschland existieren drei Hauptwege zur Psychotherapie:\n1. Gesetzliche Krankenversicherung: Volle Kostenübernahme bei Therapeuten mit Kassensitz.\n2. Kostenerstattungsverfahren: Wenn nachweislich zeitnah kein Kassenplatz auffindbar ist (§ 13 Abs. 3 SGB V).\n3. Private Krankenversicherung / Selbstzahler: Nach individuellem Tarif bzw. Honorarvereinbarung.',
        claimIds: ['claim_care_funding_paths'],
        subtext: 'Die meisten Menschen in Deutschland nutzen die kassenfinanzierte Regelversorgung.',
        subtextClaimIds: ['claim_care_funding_paths'],
        actions: [
          {
            id: 'act_st_interest_routes',
            type: 'INTEREST',
            label: 'Das interessiert mich: Kassenversorgung vs. Kostenerstattung',
            description: 'Du hast Interesse an den Finanzierungs- und Abrechnungswegen von Psychotherapie hinterlegt.',
            claimIds: ['claim_care_funding_paths']
          },
          {
            id: 'act_st_bookmark_funding',
            type: 'BOOKMARK',
            label: 'Für später merken: Abrechnungswege der Psychotherapie',
            description: 'Übersicht über Kassenantrag, Kostenerstattung und Privatleistungen.',
            claimIds: ['claim_care_funding_paths']
          }
        ]
      }
    },
    {
      id: 'st_ticket_counter',
      title: 'Der Auskunftsschalter',
      subtitle: 'Wissensüberprüfung zu den ersten Schritten',
      xPercent: 74,
      yPercent: 55,
      icon: 'message-circle',
      zIndex: 10,
      dialogue: {
        speaker: 'Schalterbeamtin Clara',
        speakerRole: 'Reiseberaterin',
        text: '„Guten Tag! Bevor Sie Ihre Reise antreten: Wissen Sie, was der allererste Schritt im Regelsystem ist?“',
        claimIds: ['claim_care_116117_ptv11'],
        actions: [
          {
            id: 'act_st_quiz_first_step',
            type: 'QUIZ',
            label: 'Wissensfrage beantworten: Der erste offizielle Schritt',
            claimIds: ['claim_care_116117_ptv11'],
            quiz: {
              question: 'Welcher Schritt ist der reguläre Einstieg in eine ambulante Psychotherapie bei der gesetzlichen Krankenkasse?',
              options: [
                'Man muss zwingend zuerst einen 4-wöchigen Klinikaufenthalt nachweisen.',
                'Man vereinbart einen Termin für eine „Psychotherapeutische Sprechstunde“ zur Erstabklärung.',
                'Man muss vorab eine Genehmigung direkt bei der Krankenkasse vor Ort beantragen.'
              ],
              correctIndex: 1,
              explanation: 'Genau so ist es! Die Psychotherapeutische Sprechstunde ist der reguläre Ersteinstieg zur diagnostischen Einschätzung, ohne dass vorab eine Überweisung zwingend erforderlich ist.',
              explanationClaimIds: ['claim_care_116117_ptv11']
            }
          }
        ]
      }
    }
  ]
};
