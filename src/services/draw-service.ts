import { Injectable } from '@angular/core';
import { triangle2D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
    public drawPoint(context: CanvasRenderingContext2D, x: number, y: number, size: number = 1, color: string = 'black'): void {
    context.moveTo(x + size / 2, y)
    context.beginPath()
    context.arc(x, y, size / 2, 0, 2 * Math.PI, false)
    context.fillStyle = color
    context.fill()
    context.closePath()
  }

  public drawLine(context: CanvasRenderingContext2D, xStart: number, yStart: number, xEnd: number, yEnd: number, width: number = 1, color: string = 'black', lineCap: 'butt' | 'round' | 'square' = 'round', lineJoin: 'bevel' | 'miter' | 'round' = 'round'): void {
    context.beginPath()
    context.moveTo(xStart, yStart)
    context.lineTo(xEnd, yEnd)
    context.strokeStyle = color
    context.lineWidth = width
    context.lineCap = lineCap
    context.lineJoin = lineJoin
    context.stroke()
    context.closePath()
  }

  public drawTriangle(context: CanvasRenderingContext2D, triangle: triangle2D, edgeWidth: number, edgeColor: string = 'black', fillColor: string = 'red', lineCap: 'butt' | 'round' | 'square' = 'round', lineJoin: 'bevel' | 'miter' | 'round' = 'round'): void {
    context.beginPath()
    context.moveTo(triangle.A.x, triangle.A.y)
    context.lineTo(triangle.B.x, triangle.B.y)
    context.lineTo(triangle.C.x, triangle.C.y)
    context.lineTo(triangle.A.x, triangle.A.y)
    context.strokeStyle = edgeColor
    context.fillStyle = fillColor
    context.lineWidth = edgeWidth
    context.closePath()
    context.fill()
    context.stroke()
  }
}
