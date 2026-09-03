import { UserState, StateListener, ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry } from '../types';
import { loadStateFromStorage, saveStateToStorage, getDefaultState } from './storage';

class AppStore {
  private state: UserState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = loadStateFromStorage();
  }

  public getState(): Readonly<UserState> {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Immediately call listener with current state
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    saveStateToStorage(this.state);
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    }
  }

  // Pure user actions - transparent, no inferences

  public markLocationVisited(locationId: string): void {
    if (!this.state.visitedLocations.includes(locationId)) {
      this.state.visitedLocations.push(locationId);
      this.notify();
    }
  }

  public markHotspotInspected(hotspotId: string): void {
    if (!this.state.inspectedHotspots.includes(hotspotId)) {
      this.state.inspectedHotspots.push(hotspotId);
      this.notify();
    }
  }

  public saveInterest(entry: InterestEntry): boolean {
    const exists = this.state.interests.some(i => i.id === entry.id);
    if (!exists) {
      this.state.interests.push(entry);
      this.notify();
      return true;
    }
    return false;
  }

  public removeInterest(id: string): void {
    this.state.interests = this.state.interests.filter(i => i.id !== id);
    this.notify();
  }

  public isInterestSaved(id: string): boolean {
    return this.state.interests.some(i => i.id === id);
  }

  public saveAboutMe(entry: AboutMeEntry): boolean {
    const exists = this.state.aboutMeMarks.some(m => m.id === entry.id);
    if (!exists) {
      this.state.aboutMeMarks.push(entry);
      this.notify();
      return true;
    }
    return false;
  }

  public removeAboutMe(id: string): void {
    this.state.aboutMeMarks = this.state.aboutMeMarks.filter(m => m.id !== id);
    this.notify();
  }

  public isAboutMeSaved(id: string): boolean {
    return this.state.aboutMeMarks.some(m => m.id === id);
  }

  public addBookmark(entry: BookmarkEntry): boolean {
    const exists = this.state.bookmarks.some(b => b.id === entry.id);
    if (!exists) {
      this.state.bookmarks.push(entry);
      this.notify();
      return true;
    }
    return false;
  }

  public removeBookmark(id: string): void {
    this.state.bookmarks = this.state.bookmarks.filter(b => b.id !== id);
    this.notify();
  }

  public isBookmarked(id: string): boolean {
    return this.state.bookmarks.some(b => b.id === id);
  }

  public collectArtifact(artifact: ArtifactEntry): boolean {
    const exists = this.state.artifacts.some(a => a.id === artifact.id);
    if (!exists) {
      this.state.artifacts.push(artifact);
      this.notify();
      return true;
    }
    return false;
  }

  public hasArtifact(artifactId: string): boolean {
    return this.state.artifacts.some(a => a.id === artifactId);
  }

  public recordQuizAnswer(questionId: string, selectedOption: number, isCorrect: boolean): void {
    this.state.quizAnswers[questionId] = {
      questionId,
      selectedOption,
      isCorrect,
      timestamp: Date.now()
    };
    this.notify();
  }

  public getQuizAnswer(questionId: string) {
    return this.state.quizAnswers[questionId];
  }

  public setIntroSeen(seen: boolean): void {
    this.state.settings.introSeen = seen;
    this.notify();
  }

  public setSoundEnabled(enabled: boolean): void {
    this.state.settings.soundEnabled = enabled;
    this.notify();
  }

  public resetAll(): void {
    this.state = getDefaultState();
    this.notify();
  }

  public replaceState(newState: UserState): void {
    this.state = newState;
    this.notify();
  }

  public getTotalCollectedCount(): number {
    return (
      this.state.artifacts.length +
      this.state.interests.length +
      this.state.aboutMeMarks.length +
      this.state.bookmarks.length
    );
  }
}

export const store = new AppStore();
