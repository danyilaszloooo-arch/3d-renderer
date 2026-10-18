import { Injectable, signal } from '@angular/core';
import { camera3D, line3D, point3D, vector3D, rotation3D, mesh3D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Scenes {
  points: point3D[] = [
    {pos: {x: -2, y: -2, z: 3}},
    {pos: {x:  2, y: -2, z: 3}},
    {pos: {x: -2, y:  2, z: 3}},
    {pos: {x:  2, y:  2, z: 3}},
    {pos: {x: -2, y: -2, z: 7}},
    {pos: {x:  2, y: -2, z: 7}},
    {pos: {x: -2, y:  2, z: 7}},
    {pos: {x:  2, y:  2, z: 7}},
  ]

  lines: line3D[] = [
  ]

  meshes: mesh3D[] = [
    { A: {x: -2, y: -2, z: 3}, B: {x:  2, y: -2, z: 3}, C: {x:  2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 3}, B: {x:  2, y:  2, z: 3}, C: {x: -2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y:  2, z: 7}, C: {x:  2, y:  2, z: 7} },
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y:  2, z: 7}, C: {x:  2, y: -2, z: 7} },
    { A: {x: 2, y: -2, z: 3}, B: {x: 2, y: -2, z: 7}, C: {x: 2, y:  2, z: 7} },
    { A: {x: 2, y: -2, z: 3}, B: {x: 2, y:  2, z: 7}, C: {x: 2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y: -2, z: 3}, C: {x: -2, y:  2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x: -2, y:  2, z: 3}, C: {x: -2, y:  2, z: 7} },
    { A: {x: -2, y: 2, z: 3}, B: {x:  2, y: 2, z: 3}, C: {x:  2, y: 2, z: 7} },
    { A: {x: -2, y: 2, z: 3}, B: {x:  2, y: 2, z: 7}, C: {x: -2, y: 2, z: 7} },
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y: -2, z: 7}, C: {x:  2, y: -2, z: 3} },
    { A: {x: -2, y: -2, z: 7}, B: {x:  2, y: -2, z: 3}, C: {x: -2, y: -2, z: 3} }
  ]

  camera = signal<camera3D>({
    position: {
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
      ...camera, position: position, rotation: rotation, nearPoint: nearPoint
    }))
  }
  public changeCameraTransform(position: vector3D, rotation: rotation3D = {yaw: 0, pitch: 0, roll: 0}): void {
    this.camera.update(camera => ({
      ...camera,
      position: {
        x: camera.position.x + position.x,
        y: camera.position.y + position.y,
        z: camera.position.z + position.z
      },
      rotation: {
        yaw: camera.rotation.yaw + rotation.yaw,
        pitch: camera.rotation.pitch + rotation.pitch,
        roll: camera.rotation.roll + rotation.roll
      }
    }))
  }
}
