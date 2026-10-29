import { Injectable } from '@angular/core';
import { mesh2D } from '../interfaces';

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

  public drawMesh(context: CanvasRenderingContext2D, mesh: mesh2D, edgeWidth: number, edgeColor: string = 'black', fillColor: string = 'red', lineCap: 'butt' | 'round' | 'square' = 'round', lineJoin: 'bevel' | 'miter' | 'round' = 'round'): void {
    context.beginPath()
    context.moveTo(mesh.A.x, mesh.A.y)
    context.lineTo(mesh.B.x, mesh.B.y)
    context.lineTo(mesh.C.x, mesh.C.y)
    context.lineTo(mesh.A.x, mesh.A.y)
    context.strokeStyle = edgeColor
    context.fillStyle = fillColor
    context.lineWidth = edgeWidth
    context.closePath()
    context.fill()
    context.stroke()
  }
}
