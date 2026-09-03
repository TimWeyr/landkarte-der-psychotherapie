/**
 * Reine Geometrie- und Kamera-Mathematik für MapEngine (100% testbar ohne DOM/Canvas)
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface ScreenDimensions {
  width: number;
  height: number;
}

export interface CameraTransform {
  scale: number;
  x: number;
  y: number;
}

/**
 * Berechnet den euklidischen Abstand zweier Punkte
 */
export function calculateDistance(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Berechnet den Mittelpunkt zwischen zwei Berührungspunkten
 */
export function calculatePinchCenter(p1: Point2D, p2: Point2D): Point2D {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

/**
 * Berechnet den neuen Skalierungsfaktor bei einer Pinch-Geste
 */
export function calculatePinchScale(
  initialDist: number,
  currentDist: number,
  initialScale: number,
  minScale: number,
  maxScale: number
): number {
  if (initialDist <= 0) return initialScale;
  const factor = currentDist / initialDist;
  const rawScale = initialScale * factor;
  return Math.max(minScale, Math.min(maxScale, rawScale));
}

/**
 * Berechnet Kamera-Position und Skalierung, um mehrere Punkte optimal auf dem Bildschirm anzuzeigen
 */
export function calculateFitBounds(
  points: Point2D[],
  screen: ScreenDimensions,
  margin = 120,
  minScale = 0.5,
  maxScale = 1.4
): CameraTransform {
  if (points.length === 0 || screen.width <= 0 || screen.height <= 0) {
    return { scale: 1, x: 0, y: 0 };
  }

  if (points.length === 1) {
    const p = points[0];
    const targetScale = Math.max(minScale, Math.min(maxScale, 1.2));
    return {
      scale: targetScale,
      x: screen.width / 2 - p.x * targetScale,
      y: screen.height / 2 - p.y * targetScale
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const pt of points) {
    minX = Math.min(minX, pt.x);
    maxX = Math.max(maxX, pt.x);
    minY = Math.min(minY, pt.y);
    maxY = Math.max(maxY, pt.y);
  }

  const boxW = Math.max(100, maxX - minX + margin * 2);
  const boxH = Math.max(100, maxY - minY + margin * 2);

  const scaleX = screen.width / boxW;
  const scaleY = screen.height / boxH;
  const targetScale = Math.max(minScale, Math.min(maxScale, Math.min(scaleX, scaleY)));

  const midWorldX = (minX + maxX) / 2;
  const midWorldY = (minY + maxY) / 2;

  return {
    scale: targetScale,
    x: screen.width / 2 - midWorldX * targetScale,
    y: screen.height / 2 - midWorldY * targetScale
  };
}

/**
 * Begrenzt eine Koordinate innerhalb elastischer Ränder
 */
export function clampDimension(
  containerPos: number,
  containerDim: number,
  screenDim: number,
  margin = 100
): number {
  if (containerDim > screenDim) {
    const min = screenDim - containerDim - margin;
    const max = margin;
    return Math.max(min, Math.min(max, containerPos));
  } else {
    return (screenDim - containerDim) / 2;
  }
}
