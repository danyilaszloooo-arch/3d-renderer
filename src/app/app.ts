import { Component, inject, signal } from '@angular/core';
import { Canvas } from '../components/canvas/canvas';

@Component({
  selector: 'app-root',
  imports: [Canvas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('3d-renderer');
}
