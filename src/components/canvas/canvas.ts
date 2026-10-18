import { RenderService } from './../../services/render-service';
import { Component, effect, ElementRef, inject, signal, viewChild, WritableSignal, } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { Scenes } from '../../services/scenes';
import { camera3D, rotation3D, vector3D } from '../../interfaces';
import { InputService } from '../../services/input-service';
import { DrawService } from '../../services/draw-service';
import { FrameService } from '../../services/frame-service';

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
  public frameService = inject(FrameService)
  public FPS: number = 0

  private centerLines: boolean = false
  public cameraPositionSensitivity: number = 0.01
  public cameraRotationSensitivity: number = 0.001

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
    this.frameService.getAverageFPS(frame)

    

    if (this.inputService.pointerLocked()) {
      requestAnimationFrame(this.startNextFrame)
    }
  }
}