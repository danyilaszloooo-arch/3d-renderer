import { line2D } from './../../interfaces';
import { Component, ElementRef, inject, viewChild, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, vector3D, point3D, vector2D, line3D } from '../../interfaces';
import { MathService } from '../../services/math-service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas {
  canvasService = inject(CanvasService)
  scenes = inject(Scenes)
  mathService = inject(MathService)

  focalLength = this.canvasService.focalLength
  drawCenterLines: boolean = true
  cameraPositionSensitivity: number = 0.01
  cameraRotationSensitivity: number = 0.001
  planeZ: number = 0.1

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')
  ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('2d')!
    this.drawScene()
  }

  public drawPoint(x: number, y: number, size: number = 1, color: string = 'black'): void {
    this.ctx.moveTo(x + size / 2, y)
    this.ctx.beginPath()
    this.ctx.arc(x, y, size / 2, 0, 2 * Math.PI, false)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.closePath()
  }

  public drawLine(xStart: number, yStart: number, xEnd: number, yEnd: number, width: number = 1, color: string = 'black', lineCap: 'butt' | 'round' | 'square' = 'round', lineJoin: 'bevel' | 'miter' | 'round' = 'round'): void {
    this.ctx.beginPath()
    this.ctx.moveTo(xStart, yStart)
    this.ctx.lineTo(xEnd, yEnd)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.lineCap = lineCap
    this.ctx.lineJoin = lineJoin
    this.ctx.stroke()
    this.ctx.closePath()
  }

  public changeFocalLength(value: number): void {
    this.focalLength.set(value)
    this.drawScene()
  }

  public toggleLines(value: boolean): void {
    this.drawCenterLines = value
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
 
  public drawScene(camera: camera3D = this.scenes.camera()): void {
    this.ctx.clearRect(0, 0, this.canvasService.width, this.canvasService.height)
    if (this.drawCenterLines) {
      this.drawLine(this.canvasService.width / 2, 0, this.canvasService.width / 2, this.canvasService.height, 0.5, 'white', 'square')
      this.drawLine(0, this.canvasService.height / 2, this.canvasService.width, this.canvasService.height / 2, 0.5, 'white', 'square')
    }
    this.scenes.points.forEach(point => {
      let relativePos: vector3D = this.mathService.getRelativePosition3D(point.pos, camera.pos, camera)
      if (relativePos.z > 0) {
        let projectedPos: vector2D = this.mathService.getProjectedPosition2D(relativePos, this.focalLength())
        let renderedPos: vector2D = this.mathService.getRenderedPosition2D(projectedPos, this.canvasService.canvasCenter)
        this.drawPoint(renderedPos.x, renderedPos.y, 10, 'white')
      }
    });
    this.scenes.lines.forEach(line => {
      const relativeStart: vector3D = this.mathService.getRelativePosition3D(line.start, camera.pos, camera)
      const relativeEnd: vector3D = this.mathService.getRelativePosition3D(line.end, camera.pos, camera)
      const relativeLine: line3D | number = this.mathService.cutLineAtEdge({start: relativeStart, end: relativeEnd}, this.planeZ)
      if (typeof relativeLine !== 'number') {
        const projectedStart: vector2D = this.mathService.getProjectedPosition2D(relativeLine.start, this.focalLength())
        const projectedEnd: vector2D = this.mathService.getProjectedPosition2D(relativeLine.end, this.focalLength())
        const renderedStart: vector2D = this.mathService.getRenderedPosition2D(projectedStart, this.canvasService.canvasCenter)
        const renderedEnd: vector2D = this.mathService.getRenderedPosition2D(projectedEnd, this.canvasService.canvasCenter)
        this.drawLine(renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 10, 'white')
      }
    })
  }
}