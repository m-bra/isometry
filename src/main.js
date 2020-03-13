
var gl,
    parameters = {  start_time  : new Date().getTime() },
    uniforms = {
        time : [ parameters.start_time - parameters.start_time ],
        resolution: [0, 0],
    };

const vertex_shader = `
    in vec3 vertex_position;
    
    void main() {

        gl_Position = vec4(vertex_position, 1.0);

    }
`;

const fragment_shader = `
    uniform float time;
    uniform vec2 resolution;

    out vec4 frag_color;

    void main( void ) {
        //float red = abs( sin( position.x * position.y + time / 5.0 ) );
        //float green = abs( sin( position.x * position.y + time / 4.0 ) );
        //float blue = abs( sin( position.x * position.y + time / 3.0 ) );
        float red = gl_FragCoord.r;
        float green = gl_FragCoord.g;
        float blue = gl_FragCoord.r;
        frag_color = vec4( red, green, blue, 1.0 );

    }
`;


require(['glh'], function (glh) {

    let canvas = document.querySelector( 'canvas' );
    gl = glh.createContext(canvas);

    // Create Program

    const program = gl.h.createProgramFromShaders( vertex_shader, fragment_shader );
    const attrib_vertex_position = gl.getAttribLocation(program, "vertex_position");

    const buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ 
        - 1.0, - 1.0, 
        1.0, - 1.0, 
        - 1.0, 1.0, 
        1.0, - 1.0, 
        1.0, 1.0, 
        - 1.0, 1.0 
    ] ), gl.STATIC_DRAW );

    /*let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.vertexAttribPointer( attrib_vertex_position, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( attrib_vertex_position );
    /*
    gl.h.vertexAttribPointer( program, vao, [
        { 
            attrib_name: "vertex_position", 
            component_count: 2, 
            component_type: gl.FLOAT, 
            source_buffer: buffer 
        }
    ]);
    //*/

    animate();

    function animate() {

        resizeCanvas(canvas);
        render();
        requestAnimationFrame( animate );

    }

    function render() {

        if ( !program ) return;

        uniforms.time[0] = (new Date().getTime() - parameters.start_time) / 1000;

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        gl.clearColor( .01, .7, .01, 1);

        gl.useProgram( program );

        gl.h.send_uniforms( program, uniforms);


        // Render geometry
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.vertexAttribPointer( attrib_vertex_position, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( attrib_vertex_position );
        //gl.bindVertexArray(vao);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
        gl.disableVertexAttribArray( attrib_vertex_position );
    }
});


function resizeCanvas( canvas ) {

    if ( canvas.width != canvas.clientWidth ||
            canvas.height != canvas.clientHeight ) {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        uniforms.resolution[0] = canvas.width;
        uniforms.resolution[1] = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );

    }

}