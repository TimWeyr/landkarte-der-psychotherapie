import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculatePinchCenter,
  calculatePinchScale,
  calculateFitBounds,
  clampDimension
} from '../src/engine/mapGeometry';

describe('Map Geometry & Camera Mathematics Tests', () => {
  it('should calculate euclidean distance between two points accurately', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 300, y: 400 };
    expect(calculateDistance(p1, p2)).toBe(500);
  });

  it('should calculate pinch midpoint accurately for touch gestures', () => {
    const p1 = { x: 100, y: 200 };
    const p2 = { x: 300, y: 600 };
    const center = calculatePinchCenter(p1, p2);
    expect(center).toEqual({ x: 200, y: 400 });
  });

  it('should compute pinch scale with boundary clamping', () => {
    // Initial dist 100, current dist 200 -> factor 2.0 -> scale 2.0
    const scale1 = calculatePinchScale(100, 200, 1.0, 0.5, 2.2);
    expect(scale1).toBe(2.0);

    // Initial dist 100, current dist 400 -> factor 4.0 -> clamped to maxScale 2.2
    const scaleClampedMax = calculatePinchScale(100, 400, 1.0, 0.5, 2.2);
    expect(scaleClampedMax).toBe(2.2);

    // Initial dist 100, current dist 20 -> factor 0.2 -> clamped to minScale 0.5
    const scaleClampedMin = calculatePinchScale(100, 20, 1.0, 0.5, 2.2);
    expect(scaleClampedMin).toBe(0.5);
  });

  it('should calculate camera fit bounds for single point', () => {
    const screen = { width: 1000, height: 800 };
    const points = [{ x: 400, y: 300 }];
    const transform = calculateFitBounds(points, screen);

    expect(transform.scale).toBe(1.2);
    expect(transform.x).toBe(1000 / 2 - 400 * 1.2);
    expect(transform.y).toBe(800 / 2 - 300 * 1.2);
  });

  it('should calculate camera fit bounds for multiple points with bounding box', () => {
    const screen = { width: 1200, height: 900 };
    const points = [
      { x: 200, y: 200 },
      { x: 800, y: 600 }
    ];
    const transform = calculateFitBounds(points, screen, 100, 0.5, 1.5);

    expect(transform.scale).toBeGreaterThanOrEqual(0.5);
    expect(transform.scale).toBeLessThanOrEqual(1.5);
    // Center of points is (500, 400)
    expect(transform.x).toBe(1200 / 2 - 500 * transform.scale);
    expect(transform.y).toBe(900 / 2 - 400 * transform.scale);
  });

  it('should clamp dimensions within margins', () => {
    const containerDim = 2000;
    const screenDim = 1000;
    const margin = 100;

    // Normal inside bounds
    expect(clampDimension(-500, containerDim, screenDim, margin)).toBe(-500);

    // Overshoot left/top
    expect(clampDimension(200, containerDim, screenDim, margin)).toBe(100);

    // Overshoot right/bottom
    expect(clampDimension(-1500, containerDim, screenDim, margin)).toBe(-1100);
  });
});
