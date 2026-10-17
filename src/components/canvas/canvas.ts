import { line2D } from './../../interfaces';
import { Component, ElementRef, inject, viewChild, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, vector3D, point3D, vector2D, line3D } from '../../interfaces';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas {
  canvasService = inject(CanvasService)
  scenes = inject(Scenes)
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
      let relativePos: vector3D = this.getRelativePosition3D(point.pos, camera.pos, camera)
      if (relativePos.z > 0) {
        let projectedPos: vector2D = this.getProjectedPosition2D(relativePos)
        let renderedPos: vector2D = this.getRenderedPosition2D(projectedPos)
        this.drawPoint(renderedPos.x, renderedPos.y, 10, 'white')
      }
    });
    this.scenes.lines.forEach(line => {
      const relativeStart: vector3D = this.getRelativePosition3D(line.start, camera.pos, camera)
      const relativeEnd: vector3D = this.getRelativePosition3D(line.end, camera.pos, camera)
      const relativeLine: line3D | number = this.cutLineAtEdge({start: relativeStart, end: relativeEnd}, this.planeZ)
      if (typeof relativeLine !== 'number') {
        const projectedStart: vector2D = this.getProjectedPosition2D(relativeLine.start)
        const projectedEnd: vector2D = this.getProjectedPosition2D(relativeLine.end)
        const renderedStart: vector2D = this.getRenderedPosition2D(projectedStart)
        const renderedEnd: vector2D = this.getRenderedPosition2D(projectedEnd)
        this.drawLine(renderedStart.x, renderedStart.y, renderedEnd.x, renderedEnd.y, 10, 'white')
      }
    })
  }

  private getRelativePosition3D(position1: vector3D, position2: vector3D, camera: camera3D): vector3D {
    const x: number = position1.x - position2.x
    const y: number = position1.y - position2.y
    const z: number = position1.z - position2.z

    const yaw = camera.rotation.yaw
    const pitch = camera.rotation.pitch
    const roll = camera.rotation.roll

    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw)
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw)
    const y1 = y

    const y2 = y1 * Math.cos(pitch) + z1 * Math.sin(pitch)
    const z2 = -y1 * Math.sin(pitch) + z1 * Math.cos(pitch)
    const x2 = x1

    const x3 = x2 * Math.cos(roll) + y2 * Math.sin(roll)
    const y3 = -x2 * Math.sin(roll) + y2 * Math.cos(roll)
    const z3 = z2

    return {x: x3, y: y3, z: z3}
  }

  private getProjectedPosition2D(relativePos: vector3D): vector2D {
    const focalLength: number = this.focalLength()
    return {
      x: (focalLength * relativePos.x) / relativePos.z,
      y: (focalLength * relativePos.y) / relativePos.z
    }
  }

  private getRenderedPosition2D(projectedPos: vector2D): vector2D {
    const canvasCenter: vector2D = this.canvasService.canvasCenter
    return {
      x: canvasCenter.x + projectedPos.x,
      y: canvasCenter.y - projectedPos.y
    }
  }

  private cutLineAtEdge(line: line3D, planeZ: number): line3D | number {
    if (line.start.z > planeZ && line.end.z > planeZ) {
      return line
    } else if (line.start.z <= planeZ && line.end.z <= planeZ) {      
      return 0
    } else {
      const intersectionPoint = this.getIntersectionPoint(line, planeZ)
      if (line.start.z > planeZ) {
        return {start: line.start, end: intersectionPoint}
      } else {
        return {start: intersectionPoint, end: line.end}
      }
    }
  }

  private getIntersectionPoint(line: line3D, planeZ: number): vector3D {
   const t: number = (planeZ - line.start.z) / (line.end.z - line.start.z)
   return {
    x: line.start.x + (line.end.x - line.start.x) * t,
    y: line.start.y + (line.end.y - line.start.y) * t,
    z: planeZ}
  }
}