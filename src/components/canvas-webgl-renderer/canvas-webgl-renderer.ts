import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { CanvasService } from '../../services/canvas-service';

@Component({
  selector: 'app-canvas-webgl-renderer',
  imports: [],
  templateUrl: './canvas-webgl-renderer.html',
})
export class CanvasWebglRenderer {
  protected canvasService = inject(CanvasService)

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasWebglRenderer')
  private ctx!: WebGL2RenderingContext

  ngAfterViewInit() {
    this.ctx = this.canvas().nativeElement.getContext('webgl2')!
  }

  protected requestPointerLock(): void {
    this.canvas().nativeElement.requestPointerLock()
  }
}
