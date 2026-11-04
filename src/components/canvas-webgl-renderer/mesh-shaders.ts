export const MESH_VERTEX_SHADER: string = `#version 300 es

layout(location = 0) in vec3 aPosition;

out float vDistance;

void main() {
  vDistance = aPosition.z;
  // Temporary, until the camera in step 5:
  // putting z into the 4th slot (w) makes the GPU divide x and y by z.
  gl_Position = vec4(aPosition.x, aPosition.y, 0.0, aPosition.z);
}`

export const MESH_FRAGMENT_SHADER: string = `#version 300 es
precision highp float;

in float vDistance;

out vec4 outColor;

void main() {
  // near (z = 3) = bright, far (z = 7) = dark
  float shade = 1.0 - (vDistance - 3.0) / 4.0 * 0.7;
  outColor = vec4(1.0 * shade, 0.85 * shade, 0.2 * shade, 1.0);
}`