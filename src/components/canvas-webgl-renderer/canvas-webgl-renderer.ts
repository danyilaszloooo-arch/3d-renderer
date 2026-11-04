import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { InputService } from '../../services/input-service';
import { POINT_VERTEX_SHADER, POINT_FRAGMENT_SHADER } from './point-shaders';

@Component({
  selector: 'app-canvas-webgl-renderer',
  imports: [],
  templateUrl: './canvas-webgl-renderer.html',
})
export class CanvasWebglRenderer {
  protected canvasService = inject(CanvasService)
  private inputService = inject(InputService)

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasWebglRenderer')
  private ctx!: WebGL2RenderingContext

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('webgl2')!
    this.drawScene()
    this.buildShader(this.ctx.VERTEX_SHADER, POINT_VERTEX_SHADER)
    this.buildShader(this.ctx.FRAGMENT_SHADER, POINT_FRAGMENT_SHADER)
  }

  constructor() {
    effect(() => {
      if (this.inputService.pointerLocked()) {
        requestAnimationFrame(this.nextFrame)
      }
    })
  }

  protected requestPointerLock(): void {
    this.canvas().nativeElement.requestPointerLock()
  }

  private nextFrame = (): void => {
    this.drawScene()
    if (this.inputService.pointerLocked()) {
      requestAnimationFrame(this.nextFrame)
    }
  }

  private drawScene(): void {
    this.ctx.clearColor(0 / 255, 54 / 255, 90 / 255, 1)
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)
  }

  private buildShader(type: number, source: string): WebGLShader {
    const shader: WebGLShader = this.ctx.createShader(type)!
    this.ctx.shaderSource(shader, source)
    this.ctx.compileShader(shader)
    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      throw new Error(this.ctx.getShaderInfoLog(shader)!)
    }
    return shader
  }
}