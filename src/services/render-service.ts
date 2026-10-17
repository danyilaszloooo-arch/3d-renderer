import { CanvasService } from './canvas-service';
import { DrawService } from './draw-service';
import { MathService } from './math-service';
import { inject, Injectable } from '@angular/core';
import { line3D, vector2D, vector3D } from '../interfaces';
import { Scenes } from './scenes';

@Injectable({
  providedIn: 'root',
})
export class RenderService {
  private drawService = inject(DrawService)
  private mathService = inject(MathService)
  private scenes = inject(Scenes)
  private canvasService = inject(CanvasService)

  private camera = this.scenes.camera
  private near: number = 0.1

  public changeFocalLength(value: number): void {
    this.camera.update(camera => ({ ...camera, focalLength: value }))
  }

  public renderPoints(context: CanvasRenderingContext2D): void {
    this.scenes.points.forEach(point => {
      let relativePos: vector3D = this.mathService.getRelativePosition3D(point.pos, this.camera().pos, this.camera())
      if (relativePos.z > 0) {
        let projectedPos: vector2D = this.mathService.getProjectedPosition2D(relativePos, this.camera().focalLength)
        let renderedPos: vector2D = this.mathService.getRenderedPosition2D(projectedPos, this.canvasService.canvasCenter)
        this.drawService.drawPoint(context, renderedPos.x, renderedPos.y, 10, 'white')
      }
    })
  }

  public renderLine(context: CanvasRenderingContext2D): void {
    this.scenes.lines.forEach(line => {
      const relativeStart: vector3D = this.mathService.getRelativePosition3D(line.start, this.camera().pos, this.camera())
      const relativeEnd: vector3D = this.mathService.getRelativePosition3D(line.end, this.camera().pos, this.camera())
      const relativeLine: line3D | number = this.mathService.cutLineAtEdge({start: relativeStart, end: relativeEnd}, this.near)
      if (typeof relativeLine !== 'number') {
        const projectedStart: vector2D = this.mathService.getProjectedPosition2D(relativeLine.start, this.camera().focalLength)
        const projectedEnd: vector2D = this.mathService.getProjectedPosition2D(relativeLine.end, this.camera().focalLength)
        const renderedStart: vector2D = this.mathService.getRenderedPosition2D(projectedStart, this.canvasService.canvasCenter)
        const renderedEnd: vector2D = this.mathService.getRenderedPosition2D(projectedEnd, this.canvasService.canvasCenter)
        this.drawService.drawLine(context, renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 10, 'white')
      }
    })
  }
}
