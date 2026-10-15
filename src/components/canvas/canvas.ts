import { Component, ElementRef, inject, viewChild, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, vector3D, point3D, vector2D } from '../../interfaces';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas {
  canvasService = inject(CanvasService)
  scenes = inject(Scenes)

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')
  ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('2d')!
    this.drawLine(this.canvasService.width / 2, 0, this.canvasService.width / 2, this.canvasService.height, 0.5, 'white', 'square')
    this.drawLine(0, this.canvasService.height / 2, this.canvasService.width, this.canvasService.height / 2, 0.5, 'white', 'square')
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

  public drawScene(camera: camera3D = this.scenes.camera): void {
    this.scenes.points.forEach(point => {
      let relativePos = this.getRelativePosition3D(point, camera)
      if (relativePos.z > 0) {
        let projectedPos: vector2D = this.getProjectedPosition2D(relativePos)
        let renderedPos: vector2D = this.getRenderedPosition2D(projectedPos)
        this.drawPoint(renderedPos.x, renderedPos.y, 10, 'white')
      }
    });
  }

  private getRelativePosition3D(element1: point3D, element2: point3D): vector3D {
    let xRel: number = element1.pos.x = element2.pos.x
    let yRel: number = element1.pos.y = element2.pos.y
    let zRel: number = element1.pos.z = element2.pos.z
    let relativePos: vector3D = {x: xRel, y: yRel, z: zRel}
    return relativePos
  }

  private getProjectedPosition2D(relativePos: vector3D): vector2D {
    let focalLength: number = this.canvasService.focalLength
    let offsetX: number = (focalLength * relativePos.x) / relativePos.z
    let offsetY: number = (focalLength * relativePos.y) / relativePos.z
    let offset2D: vector2D = {x: offsetX, y: offsetY}
    return offset2D
  }

  private getRenderedPosition2D(projectedPos: vector2D): vector2D {
    let canvasCenter: vector2D = this.canvasService.canvasCenter
    let renderedX: number = canvasCenter.x + projectedPos.x
    let renderedY: number = canvasCenter.y + projectedPos.y
    let renderedPos: vector2D = {x: renderedX, y: renderedY}
    return renderedPos
  }
}