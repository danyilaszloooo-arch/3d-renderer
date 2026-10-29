import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FrameService {
  previousFrame: number = 0
  lastFrameValues: number[] = []
  FPS: WritableSignal<number> = signal(0)
  deltaTime: WritableSignal<number> = signal(0)

  public getDeltaTime(thisFrame: number): void {
    if (this.previousFrame === null) {
      this.previousFrame = thisFrame
    }
    const deltaTime = (thisFrame - this.previousFrame) / 1000
    this.previousFrame = thisFrame
    this.deltaTime.set(deltaTime)
  }

  public getAverageFPS(frame: number): void {
    this.lastFrameValues.unshift(1 / this.deltaTime())
    if (this.lastFrameValues.length > 240) {
      this.lastFrameValues.pop()
    }
    let sum: number = 0
    for (let i = 0; i < this.lastFrameValues.length; i++) {
      sum += this.lastFrameValues[i]
    }
    const fps: number = Math.floor(sum / this.lastFrameValues.length)
    if (fps === Infinity) {
      this.FPS.set(0)
    } else {
      this.FPS.set(fps)
    }
  }
}
