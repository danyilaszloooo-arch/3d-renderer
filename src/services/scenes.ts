import { inject, Injectable } from '@angular/core';
import { camera3D, point3D } from '../interfaces';
import { CanvasService } from './canvas-service';

@Injectable({
  providedIn: 'root',
})
export class Scenes {
  points: point3D[] = [ {pos: {x: 3, y: 2, z: 5}} ]
  camera: camera3D = {
    pos: {x: 0, y: 0, z: 0},
    focalLength: 800
  }
}
