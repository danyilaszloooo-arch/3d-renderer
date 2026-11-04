import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { InputService } from '../../services/input-service';
import { TRIANGLE_VERTEX_SHADER, TRIANGLE_FRAGMENT_SHADER } from './triangle-shaders';
import { MESH_VERTEX_SHADER, MESH_FRAGMENT_SHADER } from './mesh-shaders';
import { Scenes } from '../../services/scenes';

@Component({
  selector: 'app-canvas-webgl-renderer',
  imports: [],
  templateUrl: './canvas-webgl-renderer.html',
})
export class CanvasWebglRenderer {
  protected canvasService = inject(CanvasService)
  private inputService = inject(InputService)
  private scenes = inject(Scenes)

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasWebglRenderer')
  private ctx!: WebGL2RenderingContext
  private program!: WebGLProgram
  private triangleVao!: WebGLVertexArrayObject

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('webgl2')!
    const vertexShader: WebGLShader = this.buildShader(this.ctx.VERTEX_SHADER, MESH_VERTEX_SHADER)
    const fragmentShader: WebGLShader = this.buildShader(this.ctx.FRAGMENT_SHADER, MESH_FRAGMENT_SHADER)
    this.program = this.buildProgram(vertexShader, fragmentShader)
    this.buildTriangle()
    this.drawScene()
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
    this.ctx.useProgram(this.program)
    this.ctx.bindVertexArray(this.triangleVao)
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3)
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

  private buildProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program: WebGLProgram = this.ctx.createProgram()
    this.ctx.attachShader(program, vertexShader)
    this.ctx.attachShader(program, fragmentShader)
    this.ctx.linkProgram(program)
    if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
      throw new Error(this.ctx.getProgramInfoLog(program)!)
    }
    return program
  }

  private buildTriangle(): void {
    const triangle: Float32Array = new Float32Array(
      [
        -0.5, -0.5,
        0.5, -0.5,
        0.0,  0.5
      ]
    )
    this.triangleVao = this.ctx.createVertexArray()
    this.ctx.bindVertexArray(this.triangleVao)
    const buffer: WebGLBuffer = this.ctx.createBuffer()
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer)
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, triangle, this.ctx.STATIC_DRAW)
    this.ctx.enableVertexAttribArray(0)
    this.ctx.vertexAttribPointer(0, 2, this.ctx.FLOAT, false, 0, 0)
    this.ctx.bindVertexArray(null)
  }

  private buildMesh(): void {
    
  }
}