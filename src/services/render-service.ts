import { DrawService } from './draw-service';
import { MathService } from './math-service';
import { inject, Injectable } from '@angular/core';
import { camera3D, line3D, point3D, vector2D, vector3D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RenderService {
  private drawService = inject(DrawService)
  private mathService = inject(MathService)

  public renderPoint(context: CanvasRenderingContext2D, point: point3D, camera: camera3D, focalLength: number, canvasCenter: vector2D) {
    let relativePos: vector3D = this.mathService.getRelativePosition3D(point.pos, camera.pos, camera)
    if (relativePos.z > 0) {
      let projectedPos: vector2D = this.mathService.getProjectedPosition2D(relativePos, focalLength)
      let renderedPos: vector2D = this.mathService.getRenderedPosition2D(projectedPos, canvasCenter)
      this.drawService.drawPoint(context, renderedPos.x, renderedPos.y, 10, 'white')
    }
  }

  public renderLine(context: CanvasRenderingContext2D, line: line3D, camera: camera3D, planeZ: number, focalLength: number, canvasCenter: vector2D) {
    const relativeStart: vector3D = this.mathService.getRelativePosition3D(line.start, camera.pos, camera)
    const relativeEnd: vector3D = this.mathService.getRelativePosition3D(line.end, camera.pos, camera)
    const relativeLine: line3D | number = this.mathService.cutLineAtEdge({start: relativeStart, end: relativeEnd}, planeZ)
    if (typeof relativeLine !== 'number') {
      const projectedStart: vector2D = this.mathService.getProjectedPosition2D(relativeLine.start, focalLength)
      const projectedEnd: vector2D = this.mathService.getProjectedPosition2D(relativeLine.end, focalLength)
      const renderedStart: vector2D = this.mathService.getRenderedPosition2D(projectedStart, canvasCenter)
      const renderedEnd: vector2D = this.mathService.getRenderedPosition2D(projectedEnd, canvasCenter)
      this.drawService.drawLine(context, renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 10, 'white')
    }
  }
}
