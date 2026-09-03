export interface OnboardingPoint {
  icon: string;
  title: string;
  text: string;
}

export const ONBOARDING_DATA = {
  title: 'Landkarte der Psychotherapie',
  subtitle: 'Eine interaktive Wissensreise zur Orientierung',
  disclaimer: 'Keine Diagnostik. Kein psychologischer Test. Eine ruhige, spielerische Erkundungswelt.',
  points: [
    {
      icon: 'map-pin',
      title: '1. Orte frei erkunden',
      text: 'Bewege dich über die Karte, entdecke Landmarken und betrete einzelne Schauplätze, um die Grundlagen von Psychotherapie zu verstehen.'
    },
    {
      icon: 'sparkles',
      title: '2. Fundstücke & Wissen sammeln',
      text: 'Löse kleine Wissensfragen, entdecke nützliche Orientierungshilfen und markiere Inhalte, die dir im Gedächtnis bleiben sollen.'
    },
    {
      icon: 'backpack',
      title: '3. Dein persönlicher Reiserucksack',
      text: 'Alles, was du aktiv markierst („Interessiert mich“, „Beschreibt mich“, Notizen), landet transparent in deinem Rucksack – lokal im Browser gespeichert.'
    }
  ],
  startButtonText: 'Reise beginnen',
  skipButtonText: 'Direkt zur Karte'
};
