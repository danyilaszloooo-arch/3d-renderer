import { Injectable, inject } from '@angular/core';
import { InputService } from './input-service';
import { FrameService } from './frame-service';
import { Scenes } from './scenes';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private inputService = inject(InputService)
  private frameService = inject(FrameService)
  private scenes = inject(Scenes)

  private speed: number = 10

  public movement(deltaTime: number): void {
    let x: number = 0
    let z: number = 0
    let y: number = 0

    if (this.inputService.isKeyHeld('KeyW')) z += this.speed * deltaTime
    if (this.inputService.isKeyHeld('KeyS')) z -= this.speed * deltaTime
    if (this.inputService.isKeyHeld('KeyA')) x -= this.speed * deltaTime
    if (this.inputService.isKeyHeld('KeyD')) x += this.speed * deltaTime
    if (this.inputService.isKeyHeld('Space')) y += this.speed * deltaTime
    if (this.inputService.isKeyHeld('ShiftLeft')) y -= this.speed * deltaTime

    this.scenes.changeCameraTransform({x: x, y: y, z: z})
  }
}
