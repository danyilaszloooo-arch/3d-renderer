import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InputService {

  private readonly heldKeys: Set<string> = new Set<string>()

  public readonly pointerLocked: WritableSignal<boolean> = signal(false)

  constructor() {
    window.addEventListener('keydown', key => {
      if (this.pointerLocked()) {
        this.heldKeys.add(key.code)
      }
    })

    window.addEventListener('keyup', key => {
      this.heldKeys.delete(key.code)
    })

    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement !== null
      this.pointerLocked.set(isLocked)

      if (!isLocked) this.heldKeys.clear()
    })
  }

  public anyKeyHeld(): boolean {
    return this.heldKeys.size > 0
  }

  public isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key)
  }
}
