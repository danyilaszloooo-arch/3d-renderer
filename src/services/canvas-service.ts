import { Injectable } from '@angular/core';
import { vector2D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  public width = 1600
  public height = 900
  public canvasCenter: vector2D = {x: this.width / 2, y: this.height / 2}
}
