import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { vector2D } from '../interfaces';
import { Scenes } from './scenes';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private scenes = inject(Scenes)

  public width = 1600
  public height = 900
  public canvasCenter: vector2D = {x: this.width / 2, y: this.height / 2}
  public focalLength: WritableSignal<number> = signal(this.scenes.camera().focalLength)
}
