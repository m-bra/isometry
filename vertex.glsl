#version 300 es

layout (location=0) in vec4 position;

out vec3 vColor;

uniform vec2 resolution;

void main() {
    vColor = vec3(
        (gl_VertexID + 0) % 3 == 0,
        (gl_VertexID + 1) % 3 == 0,
        (gl_VertexID + 2) % 3 == 0
    );
    gl_Position = position;

    float w = resolution.x / resolution.y;
    gl_Position.x /= w;

    gl_Position.z += 0.5; 
}