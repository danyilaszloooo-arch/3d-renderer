import { Injectable, inject } from '@angular/core';
import { InputService } from './input-service';
import { FrameService } from './frame-service';
import { Scenes } from './scenes';
import { vector2D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private inputService = inject(InputService)
  private frameService = inject(FrameService)
  private scenes = inject(Scenes)
  private mouseSensitivity: number = 0.0007
  private speed: number = 10

  public movement(deltaTime: number): void {
    const mouseMovement: vector2D = this.inputService.getMouseMovement()
    const yaw: number = this.scenes.camera().rotation.yaw
    const forward: number = Number(this.inputService.isKeyHeld('KeyW')) - Number(this.inputService.isKeyHeld('KeyS'))
    const right: number = Number(this.inputService.isKeyHeld('KeyD')) - Number(this.inputService.isKeyHeld('KeyA'))
    const inputLenght: number = Math.hypot(forward, right)
    let forwardNorm: number = forward
    let rightNorm: number = right
    if (inputLenght !== 0) {
      forwardNorm = forward / inputLenght
      rightNorm = right / inputLenght
    }
    const movementX: number = forwardNorm * Math.sin(yaw) + rightNorm * Math.cos(yaw)
    const movementY: number = Number(this.inputService.isKeyHeld('Space')) - Number(this.inputService.isKeyHeld('ShiftLeft'))
    const movementZ: number = forwardNorm * Math.cos(yaw) - rightNorm * Math.sin(yaw)
    this.scenes.changeCameraTransform(
      {
        x: movementX * this.speed * deltaTime,
        y: movementY * this.speed * deltaTime,
        z: movementZ * this.speed * deltaTime
      },
      {
        yaw: mouseMovement.x * this.mouseSensitivity,
        pitch: -mouseMovement.y * this.mouseSensitivity,
        roll: 0
      }
    )
  }
}
