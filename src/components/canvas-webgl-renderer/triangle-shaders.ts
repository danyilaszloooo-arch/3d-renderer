export const TRIANGLE_VERTEX_SHADER: string = `#version 300 es

layout(location = 0) in vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}` //AI generated

export const TRIANGLE_FRAGMENT_SHADER: string = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1.0, 0.85, 0.2, 1.0);
}` //AI generated