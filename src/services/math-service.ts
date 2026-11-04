import { Injectable } from '@angular/core';
import { camera3D, line3D, triangle2D, triangle3D, vector2D, vector3D } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MathService {
  public toCameraSpace3D(position1: vector3D, camera: camera3D): vector3D {
    const x: number = position1.x - camera.position.x
    const y: number = position1.y - camera.position.y
    const z: number = position1.z - camera.position.z
  
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
      const intersectionPoint = this.getIntersectionPoint(line.start, line.end, planeZ)
      if (line.start.z > planeZ) {
        return {start: line.start, end: intersectionPoint}
      } else {
        return {start: intersectionPoint, end: line.end}
      }
    }
  }

  private getIntersectionPoint(point1: vector3D, point2: vector3D, near: number): vector3D {
   const t: number = (near - point1.z) / (point2.z - point1.z)
   return {
    x: point1.x + (point2.x - point1.x) * t,
    y: point1.y + (point2.y - point1.y) * t,
    z: near}
  }

  public getOrientation(triangle: triangle2D): number {
    return (triangle.B.x - triangle.A.x) * (triangle.C.y - triangle.A.y) - (triangle.B.y - triangle.A.y) * (triangle.C.x - triangle.A.x)
  }

  public countPointsInFrontOfNear(triangle: triangle3D, near: number): number {
    let count: number = 0
    count += triangle.A.z >= near ? 1 : 0
    count += triangle.B.z >= near ? 1 : 0
    count += triangle.C.z >= near ? 1 : 0
    return count
  }

  public clipTriangleToNear(triangle: triangle3D, near: number): triangle3D[] {
    let order: vector3D[][] = [
      [triangle.A, triangle.B],
      [triangle.B, triangle.C],
      [triangle.C, triangle.A]
    ]
    let points: vector3D[] = []
    for (let i = 0; i < order.length; i++) {
      const start: vector3D = order[i][0]
      const end: vector3D = order[i][1]
      if (start.z >= near && end.z >= near) {
        points.push(start)
      }
      if (start.z >= near && end.z < near) {
        points.push(start)
        points.push(this.getIntersectionPoint(start, end, near))
      }
      if (start.z < near && end.z >= near) {
        points.push(this.getIntersectionPoint(start, end, near))
      }
    }
    if (points.length === 4) {
      return this.renderSubTriangles(points)
    } else if (points.length === 3) {
      return ([{A: points[0], B: points[1], C: points[2]}])
    }
    return []
  }

  public renderSubTriangles(points: vector3D[]): triangle3D[] {
    const A: vector3D = points[0]
    const B: vector3D = points[1]
    const C: vector3D = points[2]
    const D: vector3D = points[3]

    return [
      {
        A: A,
        B: B,
        C: C
      },
      {
        A: A,
        B: C,
        C: D
      }
    ]
  }
}
