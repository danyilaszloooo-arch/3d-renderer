import { Component, inject, signal } from '@angular/core';
import { Canvas3DRenderer } from '../components/canvas/canvas-3d-renderer';
import { FrameService } from '../services/frame-service';
import { CanvasWebglRenderer } from '../components/canvas-webgl-renderer/canvas-webgl-renderer';

@Component({
  selector: 'app-root',
  imports: [Canvas3DRenderer, CanvasWebglRenderer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('3d-renderer');
  protected frameService = inject(FrameService)
}
