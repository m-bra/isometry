

async function main(canvas) {
    let gl = createContext(canvas);
    gl.clearColor(0, 0, 0, 1);
    
    let program = gl.h.createProgram({sources: {
        vertexShader:  document.getElementById("vs").text.trim(),
        fragmentShader: document.getElementById("fs").text.trim()
    }});
    gl.useProgram(program);
    
    /////////////////////
    // SET UP GEOMETRY
    /////////////////////

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
    
   /* var triangleArray = gl.createVertexArray();
    gl.bindVertexArray(triangleArray);
    
    var positions = new Float32Array([
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.0, 0.5, 0.0
    ]);
    
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    
    var colors = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ]);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);
    */
    
    ////////////////
    // DRAW
    ////////////////
    
    var start = null;
    
    function frame(timestamp) {
        if (!start)
        start = timestamp;
        var progress = timestamp - start;
        window.requestAnimationFrame(frame);
    
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindVertexArray(triangle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    
    window.requestAnimationFrame(frame);
}

