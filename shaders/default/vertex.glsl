#version 300 es

uniform float time;
uniform vec2 resolution;


out vec3 vColor;

// also here generation of colorful forms from the stream of creation called "gl_VertexID",
// it perfectly splits into repeating red, green, blue.
void set_color() {
    vColor = vec3(
        float(gl_VertexID % 10) * 0.1f,
        .5f,
        .5f,
    );
}


// generate forms from gl_VertexID, which is a stream of creative light/energy from which emerge life forms.
vec3 get_position() {
    int pointID = gl_VertexID / 3;
    return vec3(
        float(pointID) * float(pointID % 2), 
        float(pointID) * float((pointID+1) % 2), 
        3.f);
}

void main() {

    // how about rendering things as really tight gl.POINTS, tighter than the resolution can display,
    // and then make dots on the screen as projections on the radar. you will not see through things and the world takes form.
    // to make better performance, it might help to artificially reduce the resolution of the display,
    // so that not so many points are needed to be simulated to make opaque objects. (how to calculate the amount of points needed?)
                                    vec3 position = get_position();
                                        //*
                                       //*
                                      //*
                                     //*
    ///////////////////////////////////////////////////////////////////////////////////
                                   
    /*    /*- - - - - - // - - -  // - - - - - - - - - - - - - - - - - - - - - - - - */

    /*    /*- - - - - - */ vec3 X;// - - - - - - - - - - - - - - - - - - - - - - - - */

    /*    /*- - - - - - // - - -  // - - - - - - - - - - - - - - - - - - - - - - - - */

    vec3 dir = vec3(0, 0, 1);     // - - - - - - - - - - - - - - - - - - - - - - - - */
          //            // //*
    vec3                  me = vec3(0, 0, 0);
          //            //        // - - - - - - - - - - - - - - - - - - - - - - - - */

          //            //        // - - - - - - - - - - - - - - - - - - - - - - - - */

    ///////////////////////////////////////////////////////////////////////////////////

    // above, you can see the position me, and from it points the direction dir,
    // and orthogonal to that direction is a plane, which is represented by the comments in between
    // and if you look up you see a new position, a new vector, possibly even in 4d *,
    // and want to project it, that is his line to me, on the plane, by intersecting that line with that plane.
    // This intersection is X, and X lies on the plane, as the projection of position on a radar, and X is the drawn target on the radar.
    // and from there on it is just school maths; oben ist die Tafel und das hier ist das Heft, wo du den
    // Text abschreibst und auch die Formeln wie folgt hinsetzt:

    // Linie PQ:
    vec3 P = me;
     vec3 Q = position.xyz;
     

    // `vec3 Y;` ist ein Punkt auf der Float-Ebene E <-> `dot(X - A, S) < 0.1` ***
    vec3 A                 = me + dir;
       vec3 S              = dir;

    // Jetzt soll die Schnittstelle gefunden werden.
    // Es wird davon ausgegangen, dass diese aus genau einem Punkt besteht (und nicht leer oder unendlich gross ist),
                                    // da ich folgenden Bereich des Codes als undefiniert definiere: 
                                    //    * "dir schaut nicht in die Richtung von position", und jetzt schaue ich, ob es eine Ungleichung mit dem Skalarprodukt gibt,
                                    //      die zeigt, dass der Winkel zwischen den Seiten groesser oder kleiner als 90° ist, und ich stosse auf ** , und das laesst sich wie folgt
                                    //      ermitteln: {
                                    //          dot(dir, position) >= 0  genau dann, wenn der Winkel nicht kleiner als 90° ist. 1)
                                    //      } .
    //  
    // Der gesuchte Punkt X auf PQ ist mit gesuchtem
        float x;
    // als 
    //     `X = P + x * (P-Q)` 
    // darstellbar.        
    // Da X aber auch auf der Ebene liegt, gilt ebenso 
    //     `dot(X-A, S) = 0`.
    // Einsetzen ergibt 
    //     `(P + x * dot(P-Q) - A, S) = 0`
    // und es folgt mit 
    //     `vec3 M = (P + x * (P-Q) - A);`,
    // dass
    //     `S.x * M.x + S.y * M.y + S.z * M.z = 0`     
    //     `S.x * x * (P-Q).x + S.y * x * (P-Q).y + S.z * x * (P-Q).z = dot(S, A-P)`
            x = dot(S, A-P) / dot(S, P-Q);
    // . Mit diesem Wert ist also X sowohl auf der Linie als auch auf der Ebene, und kann berechnet werden mit
            X = P + x * (P-Q);

    // 
    // Next chapter
    //
    // Now the radar is a field of pixels, a sensory device on "Ebene E" which consists of  points of light that shine to me to display computed, 
    // digital information that was projected from the virtual world to the plane.
    // The intersection point activates pixels around it, the function of which is a design choice that I will play with.
    // The most digital function I can think of is just choosing the nearest pixel (reacting to having multiple nearest pixels in an undefined manner)
    // and lighting it in the color of the position vertex/particle. color is information that a vertex shows around the world.
    
    set_color();

    // So in order to find this chosen pixel, we need to define how the pixels are layd out on the ebene, what their positions are in the virtual world.
    // Here again is room for design choices, an interesting vintage-possibility would be a concentric layout, which is also used in electronic microscopy right?
    // But my radar/display and most digital radars/displays/screens today (that I know of) have a rectangular layout with 2 dimensions, so I will choose that one.
    // In this layout pixels are laid in such a way that any pixel P has exactly 2 followers, 
    // The vectors that lead to the followers, which stay the same for all pixels **** are 
        vec3 right = cross(dir, vec3(0, 1, 0)); // (pick some direction on the plane) // looking directly up will make this fail
        vec3 up = cross(right, dir);   
    // . Those vectors form the basis of 2-dimensional "Ebene E". 
    // This means that the virtual-world-coordinate of any pixel on the radar is a linear combination of `up` and `right` and we label each pixel by the tuple of coefficients.

       // since right and up form unit vectors
       right /= length(right);
       up /= length(up);

    // We want to find the label of the chosen pixel so that we can send this information to the screen so that it can light the side of the pixel
    // that faces the real world. So we want to find the nearest tuple of integer coefficients to the tuple of coefficients of the linear combination
    // of `X`. We call those integer coefficients 
        ivec2 screen_coords;
    /* . For that we take X relatively to A (the origin of the projection plane) */
    /* and divide by */ mat3 plane_orientation = mat3(right, up, dir);
    /* obtaining screen coordinates, with z = 0 since X is on "Ebene E" so we can discard that value. */
        screen_coords = ivec3((X-A) * inverse(plane_orientation)).xy;

    // Now I have seen that ironically, we are already rasterizing X even though after writing to gl_Position,
    // OpenGL will again rasterize this position to display on the screen.
    // However, the physical screen can be seen as a different screen we are constructing here (a "logical screen"),
    // Since this screen is allowed to have a lower resolution of pixels than the physical screen,
    // allowing for performance regulations and a sometimes-cool shader effect! (since the rasterizing here can also be made non-rectangular and stuff)

    /* The sending of `screen_coords` to clipspace is regulated by */ vec2 radare_radius = vec2(32, 32);
    // All pixels in the radare (between -radare_radius and +radare_radius) will be fit into all of the visible clipspace (between -1 and 1)
    gl_Position.xy = vec2(screen_coords) / radare_radius;
    gl_Position.z = 0.f;
    gl_Position.w = 1.0f;

    // We pray that each vertex in virtual space is sent to us as a repeating triple (v, v, v)
    /* so that we can form this triple a triangle using */ int i = gl_VertexID % 3;
    gl_Position.x += float(i == 1) / radare_radius.x;
    gl_Position.y += float(i == 2) / radare_radius.y;

    // So wurde `position` zu `gl_Position` geleitet.

    float w = resolution.x / resolution.y;
    //gl_Position.x /= w;

    //gl_Position.z += 0.5; 
}

 //   1) daraus entwickelt sich auch eine Intuition, die das Skalarprodukt mit dem inneren Winkel hat.
    //      und ausserdem vermute ich gerade, dass, wenn das Skalarprodukt sich negiert, der Winkel komplementiert wird (also wird zu 360* - Winkel).

    // * like i just found googled that and found this haha (http://hollasch.github.io/ray4/Four-Space_Visualization_of_4D_Objects.html#chapter4)
    // ** http://www.math.uni-leipzig.de/~schueler/linalg/kapitel5.pdf

    // *** diese Gleichung zeigt, dass mit Floating-Point-Numbers keine Ebene gerade und fehlerlos dargestellt werden kann.
    //     fuer unsere Zwecke reicht das aber, und koennte als Konsequenz leicht glitchige Nebeneffekte in der Darstellung haben.
    //     Ich nenne diese Art Ebene einfach Float-Ebene.

    // **** make that vector variable according to some function or other principle for a good time

    // ---
    // Ich habe auch das Gefuehl, dass C und vor allem GLSL wie eine mathematische Gleichungssprache auf den Computer gebracht ist.
    //   float x; und x = 0; fuehlt an wie "Sei x eine beliebige reele Zahl" und "Sei X null."
    // Programmieren kann dann jetzt hier als das Umstellen der Gleichungen in eine gewisse Form, der Programmiersprache, gesehen werden.
    // Both Funktionen und Zuweisungen ist einfach das Darstellen von Werten durch Variablen
    // und dann Umleiten zu einem gewissen Speicher, oder zu mehreren, zukunftig spezifizierten Speicherbereichen.
    
