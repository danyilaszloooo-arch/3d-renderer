import { RenderService } from './../../services/render-service';
import { Component, effect, ElementRef, inject, signal, viewChild, WritableSignal, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, rotation3D, vector3D } from '../../interfaces';
import { InputService } from '../../services/input-service';
import { DrawService } from '../../services/draw-service';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas {
  protected canvasService = inject(CanvasService)
  private scenes = inject(Scenes)
  private inputService = inject(InputService)
  private drawService = inject(DrawService)
  private renderService = inject(RenderService)

  private centerLines: boolean = false
  public cameraPositionSensitivity: number = 0.01
  public cameraRotationSensitivity: number = 0.001
  private previousFrame: number | null = null
  public FPS: WritableSignal<number> = signal(0)
  private last60FPSValues: number[] = []

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas')
  private ctx!: CanvasRenderingContext2D

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('2d')!
    this.drawScene()
  }

  constructor() {
    effect(() => {
      if (this.inputService.pointerLocked()) {
        requestAnimationFrame(this.startNextFrame)
      }
    })
  }

  public changeFocalLength(value: number): void {
    this.renderService.changeFocalLength(value)
    this.drawScene()
  }

  public changeNearPoint(value: number): void {
    this.renderService.changeNearPoint(value)
    this.drawScene()
  }

  public toggleLines(value: boolean): void {
    this.centerLines = value
    this.drawScene()
  }

  public changeCameraTransform(position: vector3D, rotation: rotation3D, sensitivity: number[], nearPoint: number): void {
    this.scenes.setCameraTransform(
      {x: position.x * sensitivity[0], y: position.y * sensitivity[0], z: position.z * sensitivity[0]},
      {yaw: rotation.yaw * sensitivity[1], pitch: rotation.pitch * sensitivity[1], roll: rotation.roll * sensitivity[1]},
      nearPoint
    )
    this.drawScene()
  }
 
  private drawScene(camera: camera3D = this.scenes.camera()): void {
    this.ctx.clearRect(0, 0, this.canvasService.width, this.canvasService.height)
    this.renderService.renderMeshes(this.ctx)
    this.renderService.renderPoints(this.ctx)
    this.renderService.renderLine(this.ctx)
    this.drawService.drawCenterLines(this.ctx, this.centerLines, this.canvasService.width, this.canvasService.height)
  }

  protected requestPointerLock(): void {
    this.canvas().nativeElement.requestPointerLock()
  }

  public startNextFrame = (frame: number): void => {
    this.getAverageFPS(frame)



    if (this.inputService.pointerLocked()) {
      requestAnimationFrame(this.startNextFrame)
    }
  }

  private deltaTime(thisFrame: number) {
    if (this.previousFrame === null) {
      this.previousFrame = thisFrame
    }
    const deltaTime = (thisFrame - this.previousFrame) / 1000
    this.previousFrame = thisFrame
    return deltaTime
  }

  private getAverageFPS(frame: number) {
    this.last60FPSValues.unshift(1 / this.deltaTime(frame))
    if (this.last60FPSValues.length > 120) {
      this.last60FPSValues.pop()
    }
    let sum: number = 0
    for (let i = 0; i < this.last60FPSValues.length; i++) {
      sum += this.last60FPSValues[i]
    }
    const fps: number = Math.floor(sum / this.last60FPSValues.length)
    if (fps === Infinity) {
      this.FPS.set(0)
    } else {
      this.FPS.set(fps)
    }
  }
}