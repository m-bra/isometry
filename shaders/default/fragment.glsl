#version 300 es
precision highp float;

in vec3 vColor;
out vec4 fragColor;

uniform float delta_time;
uniform float time;

vec3 rgb2hsv(vec3);
vec3 hsv2rgb(vec3);

// particle in virtual world with information structures
// -> pixel on radar with information structures
// -> generate pixel object on logical display that displays the information, e.g. color, on the physical display

// in this case, the information structure is not even usual color,
// it is a vector of phases.

void main() {
    vec3 color = rgb2hsv(vColor);
    float h = fract(color.x + time * 0.03f);
    float s = color.y;
    float v = color.z;

    // h = 0.f; s = 1.f; v = 1.f; // red

    fragColor = vec4(hsv2rgb(vec3(h, s, v)), 1.0);
}

// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl

// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}