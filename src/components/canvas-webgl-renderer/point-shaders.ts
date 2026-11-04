export const POINT_VERTEX_SHADER: string = `#version 300 es

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 20.0;
}` //AI generated

export const POINT_FRAGMENT_SHADER: string = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1.0, 0.85, 0.2, 1.0);
}` //AI generated