
var gl;

function createContext(canvas) {
    if (gl) throw "already created gl context";

    try {
        gl = canvas.getContext("webgl2");
    } catch( error ) { throw error; }
    
    if ( !gl ) {
        throw "cannot create webgl context";
    }

    gl.h = {
        gl: gl,

        createProgram: ({sources}) => {
            let vsSource = sources.vertexShader;
            let fsSource = sources.fragmentShader;

            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vsSource);
            gl.compileShader(vertexShader);
            
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(vertexShader));
            }
            
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fsSource);
            gl.compileShader(fragmentShader);
            
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(fragmentShader));
            }
            
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
            }
            
            return program;
        },
    
        _uniform_map: {},
    
        send_uniform_vec: ( program, location, floats ) => {
            //var gl = this.gl;
            gl.useProgram(program);
    
            var location_i;
            if (location in gl.h._uniform_map) {
                location_i = gl.h._uniform_map[location];
            } else {
                location_i = gl.getUniformLocation(program, location);
                gl.h._uniform_map[location] = location_i;
            }

           // location_i = gl.getUniformLocation(program, location);
    
            if (floats.length == 1) {
                gl.uniform1f(location_i, floats[0]);
            } else if (floats.length == 2) {
                gl.uniform2f(location_i, floats[0], floats[1]);
            } else if (floats.length == 3) {
                gl.uniform3f(location_i, floats[0], floats[1], floats[2]);
            } else if (floats.length == 4) {
                gl.uniform4f(location_i, floats[0], floats[1], floats[2], floats[3]);
            }
        },

        send_uniforms: ( program, uniforms ) => {
            //var gl = this.gl;
            for (uniform in uniforms) {
                gl.h.send_uniform_vec(program, uniform, uniforms[uniform])
            }
        },

        // parameters: { 
        //    attrib_name or attrib_loc, 
        //    component_count, 
        //    component_type, normalized = false (if component_type is (half) float), 
        //    stride = 0, 
        //    offset = 0, 
        //    source_buffer (a vbo) or source_array (a Float32Array)
        //  }
        vertexAttribute: ( program, vao, parameters) => {
            
            for (let param of parameters) {
                if (param.normalized == undefined) {
                    if (param.component_type == gl.FLOAT || param.component_type == gl.HALF_FLOAT) {
                        param.normalized = false; // doesnt matter according to spec
                    } else throw "gl.h.vertexAttribPointer: need to specify `normalized` when component_type is not float.";
                }
    
                if (param.stride == undefined) {
                    param.stride = 0;
                }
    
                if (param.offset == undefined) {
                    param.offset = 0;
                }

                if (param.source_array !== undefined) {
                    console.assert(param.source_buffer == undefined);
                    param.source_buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, param.source_buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, param.source_array, gl.STATIC_DRAW);
                }

                if (param.attrib_name !== undefined) {
                    console.assert(param.attrib_loc == undefined);
                    param.attrib_loc = gl.getAttribLocation(program, param.attrib_name);
                }

                if (param.source_buffer == undefined) throw "missing field";
            }

            gl.bindVertexArray(vao);
            for (const param of parameters) {
                const { attrib_loc, component_count, component_type, normalized, stride, offset, source_buffer } = param; 
                gl.bindBuffer(gl.ARRAY_BUFFER, source_buffer);
                gl.vertexAttribPointer(attrib_loc, component_count, component_type, normalized, stride, offset);
                gl.enableVertexAttribArray( attrib_loc );
            }
        }
    }    

    return gl;
}

define({
    createContext: createContext,
});