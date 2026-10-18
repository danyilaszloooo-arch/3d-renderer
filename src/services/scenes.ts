import { Injectable, signal } from '@angular/core';
import { camera3D, line3D, point3D, vector3D, rotation3D, mesh3D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Scenes {
  points: point3D[] = [
    // // corners
    // {pos: {x: -2, y: -2, z: 3}},
    // {pos: {x:  2, y: -2, z: 3}},
    // {pos: {x: -2, y:  2, z: 3}},
    // {pos: {x:  2, y:  2, z: 3}},
    // {pos: {x: -2, y: -2, z: 7}},
    // {pos: {x:  2, y: -2, z: 7}},
    // {pos: {x: -2, y:  2, z: 7}},
    // {pos: {x:  2, y:  2, z: 7}},

    // // edges along x
    // {pos: {x: -1, y: -2, z: 3}}, {pos: {x: 0, y: -2, z: 3}}, {pos: {x: 1, y: -2, z: 3}},
    // {pos: {x: -1, y:  2, z: 3}}, {pos: {x: 0, y:  2, z: 3}}, {pos: {x: 1, y:  2, z: 3}},
    // {pos: {x: -1, y: -2, z: 7}}, {pos: {x: 0, y: -2, z: 7}}, {pos: {x: 1, y: -2, z: 7}},
    // {pos: {x: -1, y:  2, z: 7}}, {pos: {x: 0, y:  2, z: 7}}, {pos: {x: 1, y:  2, z: 7}},

    // // edges along y
    // {pos: {x: -2, y: -1, z: 3}}, {pos: {x: -2, y: 0, z: 3}}, {pos: {x: -2, y: 1, z: 3}},
    // {pos: {x:  2, y: -1, z: 3}}, {pos: {x:  2, y: 0, z: 3}}, {pos: {x:  2, y: 1, z: 3}},
    // {pos: {x: -2, y: -1, z: 7}}, {pos: {x: -2, y: 0, z: 7}}, {pos: {x: -2, y: 1, z: 7}},
    // {pos: {x:  2, y: -1, z: 7}}, {pos: {x:  2, y: 0, z: 7}}, {pos: {x:  2, y: 1, z: 7}},

    // // edges along z
    // {pos: {x: -2, y: -2, z: 4}}, {pos: {x: -2, y: -2, z: 5}}, {pos: {x: -2, y: -2, z: 6}},
    // {pos: {x:  2, y: -2, z: 4}}, {pos: {x:  2, y: -2, z: 5}}, {pos: {x:  2, y: -2, z: 6}},
    // {pos: {x: -2, y:  2, z: 4}}, {pos: {x: -2, y:  2, z: 5}}, {pos: {x: -2, y:  2, z: 6}},
    // {pos: {x:  2, y:  2, z: 4}}, {pos: {x:  2, y:  2, z: 5}}, {pos: {x:  2, y:  2, z: 6}}
  ]

  lines: line3D[] = [
    // {start: {x: -2, y: -2, z: 3}, end: {x: 2, y: 2, z: 3}}
  ]

  meshes: mesh3D[] = [
    // front (z = 3)
    { A: {x: -2, y: -2, z: 3}, B: {x:  2, y: -2, z: 3}, C: {x:  2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 3}, B: {x:  2, y:  2, z: 3}, C: {x: -2, y:  2, z: 3} },

    // back (z = 7)
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y:  2, z: 7}, C: {x:  2, y:  2, z: 7} },
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y:  2, z: 7}, C: {x:  2, y: -2, z: 7} },

    // right (x = 2)
    { A: {x: 2, y: -2, z: 3}, B: {x: 2, y: -2, z: 7}, C: {x: 2, y:  2, z: 7} },
    { A: {x: 2, y: -2, z: 3}, B: {x: 2, y:  2, z: 7}, C: {x: 2, y:  2, z: 3} },

    // left (x = -2)
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y: -2, z: 3}, C: {x: -2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y:  2, z: 3}, C: {x: -2, y:  2, z: 7} },

    // top (y = 2)
    { A: {x: -2, y: 2, z: 3}, B: {x:  2, y: 2, z: 3}, C: {x:  2, y: 2, z: 7} },
    { A: {x: -2, y: 2, z: 3}, B: {x:  2, y: 2, z: 7}, C: {x: -2, y: 2, z: 7} },

    // bottom (y = -2)
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y: -2, z: 7}, C: {x:  2, y: -2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y: -2, z: 3}, C: {x: -2, y: -2, z: 3} }
  ]

  camera = signal<camera3D>({
    pos: {
      x: 0,
      y: 0,
      z: 0
    },
    focalLength: 500,
    rotation: {
      yaw: 0,
      pitch: 0,
      roll: 0
    },
    nearPoint: 0.1
  })

  public setCameraTransform(position: vector3D, rotation: rotation3D, nearPoint: number): void {
    this.camera.update(camera => ({
      ...camera, pos: position, rotation: rotation, nearPoint: nearPoint
    }))
  }
}
