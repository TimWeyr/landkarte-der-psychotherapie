import { Container, Graphics, Text, TextStyle, FederatedPointerEvent, Circle } from 'pixi.js';
import { LocationNode } from '../types';

export interface LandmarkCallbacks {
  onSelect: (location: LocationNode, screenPos: { x: number; y: number }) => void;
  onHoverEnter?: (location: LocationNode, screenPos: { x: number; y: number }) => void;
  onHoverLeave?: (location: LocationNode) => void;
}

export class LandmarkSprite extends Container {
  public locationData: LocationNode;
  private pinGraphics: Graphics;
  private pulseGraphics: Graphics;
  private labelText: Text;
  private isPlayable: boolean;
  private pulseTime: number = Math.random() * 10;
  public isHighlighted: boolean = false;

  constructor(location: LocationNode, mapWidth: number, mapHeight: number, callbacks: LandmarkCallbacks) {
    super();
    this.locationData = location;
    this.isPlayable = location.type === 'scene';

    // Position on map
    this.x = (location.xPercent / 100) * mapWidth;
    this.y = (location.yPercent / 100) * mapHeight;

    // Make interactive with a generous Circle hit area
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Circle(0, 0, 45);

    // 1. Pulse ring for playable / highlighted locations
    this.pulseGraphics = new Graphics();
    this.addChild(this.pulseGraphics);

    // 2. Main Pin Graphics
    this.pinGraphics = new Graphics();
    this.drawPin(false);
    this.addChild(this.pinGraphics);

    // 3. Text Label
    const textStyle = new TextStyle({
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 13,
      fontWeight: 'bold',
      fill: '#2d261e',
      stroke: { color: '#fffdf8', width: 4, join: 'round' }
    });

    this.labelText = new Text({
      text: location.name,
      style: textStyle
    });
    this.labelText.anchor.set(0.5, 0);
    this.labelText.y = 16;
    this.addChild(this.labelText);

    // Events with drag tolerance
    let isDown = false;
    let startPos = { x: 0, y: 0 };

    this.on('pointerdown', (e: FederatedPointerEvent) => {
      e.stopPropagation();
      isDown = true;
      startPos = { x: e.global.x, y: e.global.y };
    });

    this.on('pointerup', (e: FederatedPointerEvent) => {
      if (isDown) {
        e.stopPropagation();
        const dx = Math.abs(e.global.x - startPos.x);
        const dy = Math.abs(e.global.y - startPos.y);
        if (dx < 15 && dy < 15) {
          callbacks.onSelect(this.locationData, { x: e.global.x, y: e.global.y });
        }
      }
      isDown = false;
    });

    this.on('pointertap', (e: FederatedPointerEvent) => {
      e.stopPropagation();
      callbacks.onSelect(this.locationData, { x: e.global.x, y: e.global.y });
    });

    this.on('pointerenter', (e: FederatedPointerEvent) => {
      this.drawPin(true);
      if (callbacks.onHoverEnter) {
        callbacks.onHoverEnter(this.locationData, { x: e.global.x, y: e.global.y });
      }
    });

    this.on('pointerleave', () => {
      this.drawPin(false);
      isDown = false;
      if (callbacks.onHoverLeave) {
        callbacks.onHoverLeave(this.locationData);
      }
    });
  }

  public setHighlighted(highlighted: boolean): void {
    this.isHighlighted = highlighted;
    this.drawPin(false);
  }

  private drawPin(isHover: boolean): void {
    const g = this.pinGraphics;
    g.clear();

    const scale = isHover ? 1.25 : (this.isHighlighted ? 1.15 : 1.0);
    const radius = 10 * scale;

    // Outer shadow / glow
    if (this.isHighlighted) {
      g.circle(0, 0, radius + 8);
      g.fill({ color: 0x4a7c8e, alpha: 0.4 });
      g.stroke({ color: 0xd4af37, width: 2, alpha: 0.9 });
    } else {
      g.circle(0, 2, radius + 2);
      g.fill({ color: 0x000000, alpha: 0.25 });
    }

    // Outer brass rim
    g.circle(0, 0, radius);
    if (this.isPlayable) {
      g.fill({ color: 0xd4af37 }); // Golden brass for playable scenes
      g.stroke({ color: 0x5a3f12, width: 2.5 });
    } else {
      g.fill({ color: 0xa89984 }); // Muted stone for teasers
      g.stroke({ color: 0x4a3f35, width: 2 });
    }

    // Inner gemstone core
    const innerRadius = radius * 0.55;
    g.circle(0, 0, innerRadius);
    if (this.isPlayable) {
      g.fill({ color: this.isHighlighted ? 0x64b5f6 : (isHover ? 0xffffff : 0x8c2317) }); // Ruby / Blue glow
    } else {
      g.fill({ color: this.isHighlighted ? 0x64b5f6 : (isHover ? 0xe0d6c5 : 0x665c54) });
    }

    // Center specular highlight
    g.circle(-innerRadius * 0.35, -innerRadius * 0.35, innerRadius * 0.3);
    g.fill({ color: 0xffffff, alpha: 0.75 });
  }

  public update(deltaTime: number): void {
    if (!this.isPlayable && !this.isHighlighted) {
      this.pulseGraphics.clear();
      return;
    }

    this.pulseTime += deltaTime * 0.04;
    const pulseFactor = (Math.sin(this.pulseTime) + 1) / 2; // 0..1
    const pulseRadius = 14 + pulseFactor * 16;
    const pulseAlpha = (1 - pulseFactor) * (this.isHighlighted ? 0.7 : 0.45);

    const g = this.pulseGraphics;
    g.clear();
    g.circle(0, 0, pulseRadius);
    g.stroke({
      color: this.isHighlighted ? 0x4a7c8e : 0xd4af37,
      width: this.isHighlighted ? 2.5 : 1.5,
      alpha: pulseAlpha
    });
  }
}
