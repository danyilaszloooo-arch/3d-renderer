export interface point3D {
    pos: vector3D
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