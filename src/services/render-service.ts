import { CanvasService } from './canvas-service';
import { DrawService } from './draw-service';
import { MathService } from './math-service';
import { inject, Injectable } from '@angular/core';
import { line3D, mesh2D, mesh3D, vector2D, vector3D } from '../interfaces';
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

  public renderMeshes(context: CanvasRenderingContext2D): void {
    this.scenes.meshes.forEach(mesh => {
      const relativeMesh: mesh3D = {
        A: this.mathService.toCameraSpace3D(mesh.A, this.camera()),
        B: this.mathService.toCameraSpace3D(mesh.B, this.camera()),
        C: this.mathService.toCameraSpace3D(mesh.C, this.camera())
      }
      const meshesToRender: mesh3D[] = this.mathService.clipTriangleToNear(relativeMesh, this.scenes.camera().nearPoint * this.nearPointMultiplyer)
      meshesToRender.forEach(mesh => {
        const projectedMesh: mesh2D = {
          A: this.mathService.getProjectedPosition2D(mesh.A, this.camera().focalLength),
          B: this.mathService.getProjectedPosition2D(mesh.B, this.camera().focalLength),
          C: this.mathService.getProjectedPosition2D(mesh.C, this.camera().focalLength)
        }
        if (this.mathService.getOrientation(projectedMesh) > 0) {
          const renderedMesh: mesh2D = {
            A: this.mathService.getRenderedPosition2D(projectedMesh.A, this.canvasService.canvasCenter),
            B: this.mathService.getRenderedPosition2D(projectedMesh.B, this.canvasService.canvasCenter),
            C: this.mathService.getRenderedPosition2D(projectedMesh.C, this.canvasService.canvasCenter)
          }
          this.drawService.drawMesh(context, renderedMesh, 1, 'black', 'red')
        }
      })
    })
  }
}
