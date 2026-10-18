export interface point3D {
    pos: vector3D
}

export interface rotation3D {
    yaw: number
    pitch: number
    roll: number
}

export interface line3D {
    start: vector3D
    end: vector3D
}

export interface vector3D {
    x: number
    y: number
    z: number
}

export interface camera3D {
    pos: vector3D
    focalLength: number
    rotation: rotation3D
    nearPoint: number
}

export interface point2D {
    pos: vector2D
}

export interface line2D {
    start: vector2D
    end: vector2D
}

export interface vector2D {
    x: number
    y: number
}

export interface mesh3D {
    A: vector3D
    B: vector3D
    C: vector3D
}

export interface mesh2D {
    A: vector2D
    B: vector2D
    C: vector2D

}