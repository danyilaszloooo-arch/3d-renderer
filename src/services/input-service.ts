import { Injectable, signal, WritableSignal } from '@angular/core';
import { vector2D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class InputService {

  public readonly heldKeys: Set<string> = new Set<string>()
  private mouseMovement: vector2D = {x: 0, y: 0}
  public readonly pointerLocked: WritableSignal<boolean> = signal(false)

  constructor() {
    window.addEventListener('keydown', key => {
      if (this.pointerLocked()) {
        this.heldKeys.add(key.code)
      }
    })

    window.addEventListener('mousemove', mouse => {
      if (this.pointerLocked()) {
        this.mouseMovement.x += mouse.movementX
        this.mouseMovement.y += mouse.movementY
      }
    })

    window.addEventListener('keyup', key => {
      this.heldKeys.delete(key.code)
    })

    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement !== null
      this.pointerLocked.set(isLocked)
      if (!isLocked) {
        this.heldKeys.clear()
        this.mouseMovement = {x: 0, y: 0}
      }
    })
  }

  public anyKeyHeld(): boolean {
    return this.heldKeys.size > 0
  }

  public isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key)
  }

  public getMouseMovement(): vector2D {
    const mouseMovement: vector2D = this.mouseMovement
    this.mouseMovement = {x: 0, y: 0}
    return mouseMovement
  }
}
