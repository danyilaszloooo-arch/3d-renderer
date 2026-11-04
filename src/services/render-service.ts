import { CanvasService } from './canvas-service';
import { DrawService } from './draw-service';
import { MathService } from './math-service';
import { inject, Injectable } from '@angular/core';
import { line3D, triangle2D, triangle3D, vector2D, vector3D } from '../interfaces';
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
  private nearPointMultiplyer: number = 0.001

  public changeFocalLength(value: number): void {
    this.camera.update(camera => ({...camera, focalLength: value}))
  }

  public renderPoints(context: CanvasRenderingContext2D): void {
    this.scenes.points.forEach(point => {
      let relativePos: vector3D = this.mathService.toCameraSpace3D(point.pos, this.camera())
      if (relativePos.z > this.scenes.camera().nearPoint * this.nearPointMultiplyer) {
        let projectedPos: vector2D = this.mathService.getProjectedPosition2D(relativePos, this.camera().focalLength)
        let renderedPos: vector2D = this.mathService.getRenderedPosition2D(projectedPos, this.canvasService.canvasCenter)
        this.drawService.drawPoint(context, renderedPos.x, renderedPos.y, 5, 'white')
      }
    })
  }

  public renderLine(context: CanvasRenderingContext2D): void {
    this.scenes.lines.forEach(line => {
      const relativeStart: vector3D = this.mathService.toCameraSpace3D(line.start, this.camera())
      const relativeEnd: vector3D = this.mathService.toCameraSpace3D(line.end, this.camera())
      const relativeLine: line3D | number = this.mathService.cutLineAtEdge({start: relativeStart, end: relativeEnd}, this.scenes.camera().nearPoint * this.nearPointMultiplyer)
      if (typeof relativeLine !== 'number') {
        const projectedStart: vector2D = this.mathService.getProjectedPosition2D(relativeLine.start, this.camera().focalLength)
        const projectedEnd: vector2D = this.mathService.getProjectedPosition2D(relativeLine.end, this.camera().focalLength)
        const renderedStart: vector2D = this.mathService.getRenderedPosition2D(projectedStart, this.canvasService.canvasCenter)
        const renderedEnd: vector2D = this.mathService.getRenderedPosition2D(projectedEnd, this.canvasService.canvasCenter)
        this.drawService.drawLine(context, renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 5, 'white')
      }
    })
  }

  public renderTriangles(context: CanvasRenderingContext2D): void {
    this.scenes.triangles.forEach(triangle => {
      const relativeTriangle: triangle3D = {
        A: this.mathService.toCameraSpace3D(triangle.A, this.camera()),
        B: this.mathService.toCameraSpace3D(triangle.B, this.camera()),
        C: this.mathService.toCameraSpace3D(triangle.C, this.camera())
      }
      const trianglesToRender: triangle3D[] = this.mathService.clipTriangleToNear(relativeTriangle, this.scenes.camera().nearPoint * this.nearPointMultiplyer)
      trianglesToRender.forEach(triangle => {
        const projectedTriangle: triangle2D = {
          A: this.mathService.getProjectedPosition2D(triangle.A, this.camera().focalLength),
          B: this.mathService.getProjectedPosition2D(triangle.B, this.camera().focalLength),
          C: this.mathService.getProjectedPosition2D(triangle.C, this.camera().focalLength)
        }
        if (this.mathService.getOrientation(projectedTriangle) > 0) {
          const renderedTriangle: triangle2D = {
            A: this.mathService.getRenderedPosition2D(projectedTriangle.A, this.canvasService.canvasCenter),
            B: this.mathService.getRenderedPosition2D(projectedTriangle.B, this.canvasService.canvasCenter),
            C: this.mathService.getRenderedPosition2D(projectedTriangle.C, this.canvasService.canvasCenter)
          }
          this.drawService.drawTriangle(context, renderedTriangle, 1, 'black', 'red')
        }
      })
    })
  }
}
