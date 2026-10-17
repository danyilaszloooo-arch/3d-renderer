import { Component, ElementRef, inject, viewChild, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, vector3D, vector2D, line3D, point3D } from '../../interfaces';
import { MathService } from '../../services/math-service';
import { InputService } from '../../services/input';
import { DrawService } from '../../services/draw-service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas {
  protected canvasService = inject(CanvasService)
  private scenes = inject(Scenes)
  private mathService = inject(MathService)
  private inputService = inject(InputService)
  private drawService = inject(DrawService)

  private focalLength = this.canvasService.focalLength
  private centerLines: boolean = false
  private cameraPositionSensitivity: number = 0.01
  private cameraRotationSensitivity: number = 0.001
  private planeZ: number = 0.1

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')
  private ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('2d')!
    this.drawScene()
  }

  public changeFocalLength(value: number): void {
    this.focalLength.set(value)
    this.drawScene()
  }

  public toggleLines(value: boolean): void {
    this.centerLines = value
    this.drawScene()
  }

  public changeCameraPosition(x: number, y: number, z: number, yaw: number, pitch: number, roll: number): void {
    this.scenes.camera().pos.x = x * this.cameraPositionSensitivity
    this.scenes.camera().pos.y = y * this.cameraPositionSensitivity
    this.scenes.camera().pos.z = z * this.cameraPositionSensitivity
    this.scenes.camera().rotation.yaw = yaw * this.cameraRotationSensitivity
    this.scenes.camera().rotation.pitch = pitch * this.cameraRotationSensitivity
    this.scenes.camera().rotation.roll = roll * this.cameraRotationSensitivity
    this.drawScene()
  }
 
  private drawScene(camera: camera3D = this.scenes.camera()): void {
    this.ctx.clearRect(0, 0, this.canvasService.width, this.canvasService.height)
    this.scenes.points.forEach(point => {
      this.renderPoint(point, camera)
    });
    this.scenes.lines.forEach(line => {
      this.renderLine(line, camera)
    })
    this.drawService.drawCenterLines(this.ctx, this.centerLines, this.canvasService.width, this.canvasService.height)
  }
  
  private renderPoint(point: point3D, camera: camera3D) {
    let relativePos: vector3D = this.mathService.getRelativePosition3D(point.pos, camera.pos, camera)
    if (relativePos.z > 0) {
      let projectedPos: vector2D = this.mathService.getProjectedPosition2D(relativePos, this.focalLength())
      let renderedPos: vector2D = this.mathService.getRenderedPosition2D(projectedPos, this.canvasService.canvasCenter)
      this.drawService.drawPoint(this.ctx, renderedPos.x, renderedPos.y, 10, 'white')
    }
  }

  private renderLine(line: line3D, camera: camera3D) {
    const relativeStart: vector3D = this.mathService.getRelativePosition3D(line.start, camera.pos, camera)
    const relativeEnd: vector3D = this.mathService.getRelativePosition3D(line.end, camera.pos, camera)
    const relativeLine: line3D | number = this.mathService.cutLineAtEdge({start: relativeStart, end: relativeEnd}, this.planeZ)
    if (typeof relativeLine !== 'number') {
      const projectedStart: vector2D = this.mathService.getProjectedPosition2D(relativeLine.start, this.focalLength())
      const projectedEnd: vector2D = this.mathService.getProjectedPosition2D(relativeLine.end, this.focalLength())
      const renderedStart: vector2D = this.mathService.getRenderedPosition2D(projectedStart, this.canvasService.canvasCenter)
      const renderedEnd: vector2D = this.mathService.getRenderedPosition2D(projectedEnd, this.canvasService.canvasCenter)
      this.drawService.drawLine(this.ctx, renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 10, 'white')
    }
  }
}