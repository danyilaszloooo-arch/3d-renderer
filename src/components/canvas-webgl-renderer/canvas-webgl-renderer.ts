import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';
import { InputService } from '../../services/input-service';
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
  private meshVao!: WebGLVertexArrayObject
  private meshVertexCount!: number

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('webgl2')!
    const vertexShader: WebGLShader = this.buildShader(this.ctx.VERTEX_SHADER, MESH_VERTEX_SHADER)
    const fragmentShader: WebGLShader = this.buildShader(this.ctx.FRAGMENT_SHADER, MESH_FRAGMENT_SHADER)
    this.program = this.buildProgram(vertexShader, fragmentShader)
    this.buildMesh()
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
    this.ctx.bindVertexArray(this.meshVao)
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, this.meshVertexCount)
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

  private buildMesh(): void {
    const numbers: number[] = []
    this.scenes.triangles.forEach(t => { //t => triangle
      numbers.push(t.A.x, t.A.y, t.A.z, t.B.x, t.B.y, t.B.z, t.C.x, t.C.y, t.C.z)
    })
    const mesh: Float32Array = new Float32Array(numbers)
    this.meshVao = this.ctx.createVertexArray()
    this.ctx.bindVertexArray(this.meshVao)
    const buffer: WebGLBuffer = this.ctx.createBuffer()
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buffer)
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, mesh, this.ctx.STATIC_DRAW)
    this.ctx.enableVertexAttribArray(0)
    this.ctx.vertexAttribPointer(0, 3, this.ctx.FLOAT, false, 0, 0)
    this.ctx.bindVertexArray(null)
    this.meshVertexCount = this.scenes.triangles.length * 3
  }
}