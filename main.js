

async function main(canvas) {
    let gl = (await load("gl.h.js")).createContext(canvas);
    gl.clearColor(0, 0, 0, 1);
    
    let program = gl.h.createProgram({sources: {
        vertexShader:  await load("text!vertex.glsl"),
        fragmentShader: await load("text!fragment.glsl"),
    }});
    gl.useProgram(program);
    

    let triangle = gl.createVertexArray();
    gl.h.vertexAttribute(program, triangle, [
        { 
            attrib_name: "position", 
            component_count: 3, 
            component_type: gl.FLOAT,
            source_array: new Float32Array([
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0,
                0.0, 0.5, 0.0
            ])
        },
        { 
            attrib_name: "color", 
            component_count: 3, 
            component_type: gl.FLOAT,
            source_array: new Float32Array([
                1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0
            ])
        }
    ]);
    
    ////////////////
    // DRAW
    ////////////////
    
    var start = null;
    
    function frame(timestamp) {
        if (!start)
        start = timestamp;
        var delta_time = timestamp - start;

    
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.h.send_uniforms(program, {
            delta_time: [delta_time / 1000],
            time: [timestamp / 1000]
        });

        gl.bindVertexArray(triangle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        window.requestAnimationFrame(frame);
    }
    
    window.requestAnimationFrame(frame);
}

