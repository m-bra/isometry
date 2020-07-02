#version 300 es

#define M_PIf float(3.1415926535897932384626433832795)
#define M_2PIf (M_PIf * 2.f)

uniform float time;
uniform vec2 resolution;

uniform int forms_count;
uniform int forms_per_line;

const int parts_per_form = 2 * 3 * 3;
int form_id;
int form_part;
int current_id;

// assuming that forms_count is small enough
uniform vec3 colors[2500];

flat out vec3 vColor;

void triangle(vec3 a, vec3 b, vec3 c);

// converts polar/cylinder coords to catesian xyz coords
vec3 polar(float angle, float radius, float z) {
    return vec3(
        cos(angle) * radius,
        sin(angle) * radius,
        z
    );
}

// int a = 0b01010101

bool read_bit(int bitfield, int bitindex) {
    // bitfield = 0b00110101
    int bitmask = 1 << bitindex;
    return (bitfield & bitmask) != 0;
}

int floori(float x) {
    return int(floor(x));
}

void main() {

    form_id = gl_VertexID / parts_per_form;
    form_part = gl_VertexID % parts_per_form;
    current_id = form_id * parts_per_form + parts_per_form - 1;

    const float near = 0.f;
    const float far = -1.f;

    vColor = colors[form_id];
    float tilt = float(form_id % 2) / 6.f;
    float R = .5f;
    float r = R * cos(M_2PIf / 6.f); // distance from center of triangle to lines
    // counter-clockwise
    triangle(
        polar(M_2PIf * (.25f + .9999f + tilt), R, near),
        polar(M_2PIf * (.25f + .3333f + tilt), R, near),
        polar(M_2PIf * (.25f + .6666f + tilt), R, near)
    );
    float triangle_ystep = R + r;
    float triangle_xstep = R * sin(M_2PIf / 6.f);

    int lines_count = forms_count / forms_per_line;
    gl_Position.x += float(form_id % forms_per_line) * triangle_xstep;
    gl_Position.y += float(form_id / forms_per_line) * triangle_ystep;
    gl_Position.y += float(form_id % 2) * (R-r);

    gl_Position.x /= float(forms_per_line - 1) * triangle_xstep;
    gl_Position.y /= float(lines_count - 1) * triangle_xstep * (resolution.y / resolution.x);
    gl_Position.xy = (gl_Position.xy * 2.f) - 1.f;
    gl_Position.w = 1.f;
}

void triangle(vec3 a, vec3 b, vec3 c) {
    if (current_id < form_id * parts_per_form + 2) {
        return;
    }

    if (gl_VertexID == current_id--) {
        gl_Position.xyz = a;
    }
    if (gl_VertexID == current_id--) {
        gl_Position.xyz = b;
    }
    if (gl_VertexID == current_id--) {
        gl_Position.xyz = c;
    }
    gl_Position.w = 1.f;
}