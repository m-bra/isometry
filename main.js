var gl, canvas,
    parameters = {  start_time  : new Date().getTime() },
    uniforms = {
        time : [ parameters.start_time - parameters.start_time ],
        resolution: [0, 0],
    };


require(['glh', 'text!vertex-shader.glsl', 'text!fragment-shader.glsl'], function (glh, vertex_shader, fragment_shader) {
    var 
        buffer, vao,
        vertex_shader, fragment_shader, 
        currentProgram,
        vertex_position = 0;

    canvas = document.querySelector( 'canvas' );
    gl = glh.createContext(canvas);

    init();
    animate();

    function init() {
        // Create Vertex buffer (2 triangles)

        buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ - 1.0, - 1.0, 1.0, - 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0, 1.0, - 1.0, 1.0 ] ), gl.STATIC_DRAW );

        vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.h.vertexAttribPointer( vertex_position, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vertex_position );

        // Create Program

        currentProgram = gl.h.createProgramFromShaders( vertex_shader, fragment_shader );

    }

    function animate() {

        resizeCanvas();
        render();
        requestAnimationFrame( animate );

    }

    function render() {

        if ( !currentProgram ) return;

        uniforms.time[0] = (new Date().getTime() - parameters.start_time) / 1000;

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        gl.useProgram( currentProgram );

        gl.h.send_uniforms( currentProgram, uniforms)


        // Render geometry
        gl.bindVertexArray(vao);
        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }
});


function resizeCanvas( event ) {

    if ( canvas.width != canvas.clientWidth ||
            canvas.height != canvas.clientHeight ) {

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        uniforms.resolution[0] = canvas.width;
        uniforms.resolution[1] = canvas.height;

        gl.viewport( 0, 0, canvas.width, canvas.height );

    }

}