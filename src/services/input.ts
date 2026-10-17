import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private readonly heldKeys: Set<string> = new Set<string>()

  readonly keyDown$: Subject<string> = new Subject<string>()

  constructor() {
    window.addEventListener('keydown', key => {
      this.heldKeys.add(key.code)
      this.keyDown$.next(key.code)
    })

    window.addEventListener('keyup', key => {
      this.heldKeys.delete(key.code)
    })
  }

  public anyKeyHeld(): boolean {
    return this.heldKeys.size > 0
  }

  public isKeyHeld(key: string): boolean {
    return this.heldKeys.has(key)
  }
}
