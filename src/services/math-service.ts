import { Injectable } from '@angular/core';
import { camera3D, line3D, vector2D, vector3D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MathService {
  public getRelativePosition3D(position1: vector3D, position2: vector3D, camera: camera3D): vector3D {
    const x: number = position1.x - position2.x
    const y: number = position1.y - position2.y
    const z: number = position1.z - position2.z
  
    const yaw = camera.rotation.yaw
    const pitch = -camera.rotation.pitch
    const roll = -camera.rotation.roll
  
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw)
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw)
    const y1 = y
  
    const y2 = y1 * Math.cos(pitch) + z1 * Math.sin(pitch)
    const z2 = -y1 * Math.sin(pitch) + z1 * Math.cos(pitch)
    const x2 = x1
  
    const x3 = x2 * Math.cos(roll) + y2 * Math.sin(roll)
    const y3 = -x2 * Math.sin(roll) + y2 * Math.cos(roll)
    const z3 = z2
  
    return {x: x3, y: y3, z: z3}
  }

  public getProjectedPosition2D(relativePos: vector3D, focalLength: number): vector2D {
    return {
      x: (focalLength * relativePos.x) / relativePos.z,
      y: (focalLength * relativePos.y) / relativePos.z
    }
  }

  public getRenderedPosition2D(projectedPos: vector2D, canvasCenter: vector2D): vector2D {
    return {
      x: canvasCenter.x + projectedPos.x,
      y: canvasCenter.y - projectedPos.y
    }
  }

  public cutLineAtEdge(line: line3D, planeZ: number): line3D | number {
    if (line.start.z > planeZ && line.end.z > planeZ) {
      return line
    } else if (line.start.z <= planeZ && line.end.z <= planeZ) {      
      return 0
    } else {
      const intersectionPoint = this.getIntersectionPoint(line, planeZ)
      if (line.start.z > planeZ) {
        return {start: line.start, end: intersectionPoint}
      } else {
        return {start: intersectionPoint, end: line.end}
      }
    }
  }

  private getIntersectionPoint(line: line3D, planeZ: number): vector3D {
   const t: number = (planeZ - line.start.z) / (line.end.z - line.start.z)
   return {
    x: line.start.x + (line.end.x - line.start.x) * t,
    y: line.start.y + (line.end.y - line.start.y) * t,
    z: planeZ}
  }
}
