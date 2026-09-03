import { Application, Container, Sprite, Assets, FederatedPointerEvent } from 'pixi.js';
import { WorldMapData, LocationNode } from '../types';
import { LandmarkSprite } from './LandmarkSprite';
import { calculateDistance, calculatePinchCenter, calculatePinchScale, calculateFitBounds, clampDimension } from './mapGeometry';

export interface MapEngineOptions {
  container: HTMLElement;
  worldData: WorldMapData;
  onLocationSelect: (location: LocationNode, screenPos: { x: number; y: number }) => void;
  onLocationHover?: (location: LocationNode, screenPos: { x: number; y: number }) => void;
  onLocationLeave?: (location: LocationNode) => void;
}

export class MapEngine {
  private app!: Application;
  private options: MapEngineOptions;
  private worldContainer!: Container;
  private mapSprite!: Sprite;
  private landmarksLayer!: Container;
  private landmarkSprites: LandmarkSprite[] = [];

  // Pan and Zoom State
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private containerStart = { x: 0, y: 0 };
  private currentScale = 1;
  private minScale = 0.5;
  private maxScale = 2.2;
  private mapWidth: number;
  private mapHeight: number;

  // Multi-Touch Pinch State
  private activePointers = new Map<number, { x: number; y: number }>();
  private initialPinchDistance: number | null = null;
  private initialPinchScale = 1;

  constructor(options: MapEngineOptions) {
    this.options = options;
    this.mapWidth = options.worldData.nativeWidth;
    this.mapHeight = options.worldData.nativeHeight;
  }

  public async init(): Promise<void> {
    this.app = new Application();

    await this.app.init({
      resizeTo: this.options.container,
      backgroundColor: 0xd8cdb9,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true
    });

    this.options.container.appendChild(this.app.canvas as HTMLCanvasElement);
    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.classList.add('pixi-canvas');
    canvas.style.touchAction = 'none';

    // World root container
    this.worldContainer = new Container();
    this.worldContainer.eventMode = 'static';
    this.app.stage.addChild(this.worldContainer);

    // 1. Load Background Raster Map
    const texture = await Assets.load(this.options.worldData.imageSrc);
    this.mapSprite = new Sprite(texture);
    this.mapSprite.width = this.mapWidth;
    this.mapSprite.height = this.mapHeight;
    this.worldContainer.addChild(this.mapSprite);

    // 2. Landmarks Layer
    this.landmarksLayer = new Container();
    this.worldContainer.addChild(this.landmarksLayer);

    // Populate landmarks
    for (const loc of this.options.worldData.locations) {
      const landmark = new LandmarkSprite(
        loc,
        this.mapWidth,
        this.mapHeight,
        {
          onSelect: (location, pos) => this.options.onLocationSelect(location, pos),
          onHoverEnter: (location, pos) => this.options.onLocationHover?.(location, pos),
          onHoverLeave: (location) => this.options.onLocationLeave?.(location)
        }
      );
      this.landmarksLayer.addChild(landmark);
      this.landmarkSprites.push(landmark);
    }

    // 3. Setup Interaction Listeners
    this.setupInteractions();

    // 4. Initial Fitting
    this.fitToScreen();

    // 5. Render Ticker
    this.app.ticker.add((ticker) => {
      for (const sprite of this.landmarkSprites) {
        sprite.update(ticker.deltaTime);
      }
    });

    // Resize Observer
    window.addEventListener('resize', () => {
      this.clampPosition();
    });
  }

  private setupInteractions(): void {
    const stage = this.app.stage;
    stage.eventMode = 'static';
    stage.hitArea = this.app.screen;

    // Pointer events for panning and pinch-to-zoom
    stage.on('pointerdown', (e: FederatedPointerEvent) => {
      this.activePointers.set(e.pointerId, { x: e.global.x, y: e.global.y });

      if (this.activePointers.size === 1) {
        this.isDragging = true;
        this.dragStart = { x: e.global.x, y: e.global.y };
        this.containerStart = { x: this.worldContainer.x, y: this.worldContainer.y };
      } else if (this.activePointers.size === 2) {
        this.isDragging = false;
        const pts = Array.from(this.activePointers.values());
        this.initialPinchDistance = calculateDistance(pts[0], pts[1]);
        this.initialPinchScale = this.currentScale;
      }
    });

    stage.on('pointermove', (e: FederatedPointerEvent) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.set(e.pointerId, { x: e.global.x, y: e.global.y });
      }

      if (this.activePointers.size === 2 && this.initialPinchDistance) {
        const pts = Array.from(this.activePointers.values());
        const currentDistance = calculateDistance(pts[0], pts[1]);
        const targetScale = calculatePinchScale(
          this.initialPinchDistance,
          currentDistance,
          this.initialPinchScale,
          this.minScale,
          this.maxScale
        );

        const center = calculatePinchCenter(pts[0], pts[1]);
        const worldPos = {
          x: (center.x - this.worldContainer.x) / this.currentScale,
          y: (center.y - this.worldContainer.y) / this.currentScale
        };

        this.currentScale = targetScale;
        this.worldContainer.scale.set(targetScale);
        this.worldContainer.x = center.x - worldPos.x * targetScale;
        this.worldContainer.y = center.y - worldPos.y * targetScale;
        this.clampPosition();
      } else if (this.isDragging && this.activePointers.size === 1) {
        const dx = e.global.x - this.dragStart.x;
        const dy = e.global.y - this.dragStart.y;
        this.worldContainer.x = this.containerStart.x + dx;
        this.worldContainer.y = this.containerStart.y + dy;
        this.clampPosition();
      }
    });

    const endPointer = (e: FederatedPointerEvent) => {
      this.activePointers.delete(e.pointerId);
      if (this.activePointers.size === 0) {
        this.isDragging = false;
        this.initialPinchDistance = null;
      } else if (this.activePointers.size === 1) {
        const remaining = Array.from(this.activePointers.values())[0];
        this.isDragging = true;
        this.dragStart = { x: remaining.x, y: remaining.y };
        this.containerStart = { x: this.worldContainer.x, y: this.worldContainer.y };
        this.initialPinchDistance = null;
      }
    };

    stage.on('pointerup', endPointer);
    stage.on('pointerupoutside', endPointer);
    stage.on('pointercancel', endPointer);

    // Zoom via Wheel
    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoomAt(e.clientX, e.clientY, zoomFactor);
    }, { passive: false });
  }

  public zoomAt(screenX: number, screenY: number, factor: number): void {
    const oldScale = this.currentScale;
    let newScale = oldScale * factor;
    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));

    const worldPos = {
      x: (screenX - this.worldContainer.x) / oldScale,
      y: (screenY - this.worldContainer.y) / oldScale
    };

    this.currentScale = newScale;
    this.worldContainer.scale.set(newScale);
    this.worldContainer.x = screenX - worldPos.x * newScale;
    this.worldContainer.y = screenY - worldPos.y * newScale;

    this.clampPosition();
  }

  public zoomIn(): void {
    const centerX = this.app.screen.width / 2;
    const centerY = this.app.screen.height / 2;
    this.zoomAt(centerX, centerY, 1.25);
  }

  public zoomOut(): void {
    const centerX = this.app.screen.width / 2;
    const centerY = this.app.screen.height / 2;
    this.zoomAt(centerX, centerY, 0.8);
  }

  public resetView(): void {
    this.fitToScreen();
  }

  public highlightLocations(locationIds: string[]): void {
    for (const sprite of this.landmarkSprites) {
      sprite.setHighlighted(locationIds.includes(sprite.locationData.id));
    }
  }

  public clearHighlights(): void {
    for (const sprite of this.landmarkSprites) {
      sprite.setHighlighted(false);
    }
  }

  /**
   * Richtet Kamera und Zoom so aus, dass alle übergebenen Landmarken gleichzeitig im Bild liegen
   */
  public fitLocations(locationIds: string[]): void {
    if (locationIds.length === 0) {
      this.resetView();
      return;
    }

    const matchedSprites = this.landmarkSprites.filter(s => locationIds.includes(s.locationData.id));
    if (matchedSprites.length === 0) {
      this.resetView();
      return;
    }

    const points = matchedSprites.map(s => ({ x: s.x, y: s.y }));
    const transform = calculateFitBounds(
      points,
      { width: this.app.screen.width, height: this.app.screen.height },
      120,
      this.minScale,
      1.4
    );

    this.currentScale = transform.scale;
    this.worldContainer.scale.set(transform.scale);
    this.worldContainer.x = transform.x;
    this.worldContainer.y = transform.y;

    this.clampPosition();
  }

  public focusOnLocation(xPercent: number, yPercent: number, targetScale = 1.3): void {
    const targetX = (xPercent / 100) * this.mapWidth;
    const targetY = (yPercent / 100) * this.mapHeight;

    const screenCenterX = this.app.screen.width / 2;
    const screenCenterY = this.app.screen.height / 2;

    this.currentScale = Math.max(this.minScale, Math.min(this.maxScale, targetScale));
    this.worldContainer.scale.set(this.currentScale);

    this.worldContainer.x = screenCenterX - targetX * this.currentScale;
    this.worldContainer.y = screenCenterY - targetY * this.currentScale;

    this.clampPosition();
  }

  private fitToScreen(): void {
    if (!this.app.screen.width || !this.app.screen.height) return;

    const scaleX = this.app.screen.width / this.mapWidth;
    const scaleY = this.app.screen.height / this.mapHeight;
    const bestScale = Math.max(scaleX, scaleY) * 1.05;

    this.minScale = Math.min(scaleX, scaleY) * 0.85;
    this.currentScale = Math.max(this.minScale, Math.min(this.maxScale, bestScale));

    this.worldContainer.scale.set(this.currentScale);
    this.worldContainer.x = (this.app.screen.width - this.mapWidth * this.currentScale) / 2;
    this.worldContainer.y = (this.app.screen.height - this.mapHeight * this.currentScale) / 2;

    this.clampPosition();
  }

  private clampPosition(): void {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    const currentW = this.mapWidth * this.currentScale;
    const currentH = this.mapHeight * this.currentScale;

    this.worldContainer.x = clampDimension(this.worldContainer.x, currentW, screenW, 100);
    this.worldContainer.y = clampDimension(this.worldContainer.y, currentH, screenH, 100);
  }

  public destroy(): void {
    this.app.destroy(true, { children: true });
  }
}
