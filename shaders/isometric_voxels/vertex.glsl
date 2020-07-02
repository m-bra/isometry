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

// assuming that forms_count <= 1024
uniform vec3 colors[1024];
uniform int bitfields[1024];

flat out vec3 vColor;
flat out int vDiscard;

void triangle(vec3 a, vec3 b, vec3 c);

// converts polar/cylinder coords to catesian xyz coords
// polar.x is angle
// polar.y is length
// polar.z is copied to z
vec3 cylinder_to_xyz(vec3 polar) {
    polar.x += M_2PIf / 12.f;
    return vec3(
        cos(polar.x) * polar.y,
        sin(polar.x) * polar.y,
        polar.z
    );
}

void triangle_cyl(vec3 a, vec3 b, vec3 c) {
    triangle(cylinder_to_xyz(a), cylinder_to_xyz(b), cylinder_to_xyz(c));
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
    for (int side = 0; side < 3; ++side) {
        float fside = float(side);
        vDiscard = int(!read_bit(bitfields[form_id], side));
        // counter-clockwise
        triangle_cyl(
            vec3(0, 0, near),
            vec3(M_2PIf / 3.f * fside, 1.f, mix(near, far, 0.5f)),
            vec3(M_2PIf / 3.f * (fside+1.f), 1.f, mix(near, far, 0.5f))
        );
        triangle_cyl(
            vec3(M_2PIf / 3.f * (fside + 0.5f), 1.f, far),
            vec3(M_2PIf / 3.f * (fside+1.f), 1.f, mix(near, far, 0.5f)),
            vec3(M_2PIf / 3.f * fside, 1.f, mix(near, far, 0.5f))
        );
    }

    int lines_count = forms_count / forms_per_line;
    int even_line = (form_id / forms_per_line) % 2;
    gl_Position.x += float(form_id % forms_per_line - forms_per_line / 2) * 2.f * cos(M_2PIf / 12.f);
    gl_Position.y += float(form_id / forms_per_line - lines_count / 2) * sin(M_2PIf / 12.f);
    gl_Position.x += float(even_line) * cos(M_2PIf / 12.f);

    gl_Position.x /= float(forms_per_line);
    gl_Position.y /= float(forms_per_line) * (resolution.y / resolution.x);
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