import { Component, inject, signal } from '@angular/core';
import { Canvas3DRenderer } from '../components/canvas/canvas-3d-renderer';
import { FrameService } from '../services/frame-service';

@Component({
  selector: 'app-root',
  imports: [Canvas3DRenderer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('3d-renderer');
  protected frameService = inject(FrameService)
}
