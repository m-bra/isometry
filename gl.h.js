
var gl;

// rule:
// all functions in .h have, even if nothing else, the advantage of checking for glError().
// that is, in the beginning and in the end, if there is a glError() reported, it is thrown.

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

        /// deprecated.
        createProgram: (sources) => gl.h.compile(sources),

        /// If there is an error on GPU-side (accessed through OpenGL),
        /// throw it here.
        gpu_throws: (context) => {
            if (context === undefined)
                context = "";

            let errcode = gl.getError();
            if (errcode != 0) {
                throw context + errcode;
            }
        },

        // returns GPU program id.
        compile: ({sources}) => {
            gl.h.gpu_throws("before gl.h.compile(...)");

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
            
            gl.h.gpu_throws("after gl.h.compile(...) => GPUProgram " + program);
            return program;
        },

        program: {
            set: (program) => {
                gl.useProgram(program);
                gl.h.program._last_set = program;
            },

            get: () => {
                return gl.h.program._last_set;
            },

            _uniform_map: {},
    
            send_uniform_vec: ( location, floats ) => {
                gl.h.gpu_throws("before gl.h.program.send_uniform_vec(" +  location + ", ...)");
        
                var location_i;
                if (location in gl.h.program._uniform_map) {
                    location_i = gl.h.program._uniform_map[location];
                } else {
                    location_i = gl.getUniformLocation(program, location);
                    gl.h.program._uniform_map[location] = location_i;
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

                gl.h.gpu_throws("after gl.h.program.send_uniform_vec(" + location + ", ...)");
            },

            send_uniforms: ( uniforms ) => {
                gl.h.gpu_throws("before gl.h.program.send_uniforms(...)");

                //var gl = this.gl;
                for (uniform in uniforms) {
                    gl.h.program.send_uniform_vec(uniform, uniforms[uniform])
                }

                gl.h.gpu_throws("after gl.h.program.send_uniforms(...)");
            },

            uniform3fv: (location, floats ) => {
                gl.h.gpu_throws("before uniform3fv(" + location + ", ...)");

                //var gl = this.gl;
        
                var location_i;
                if (location in gl.h._uniform_map) {
                    location_i = gl.h._uniform_map[location];
                } else {
                    location_i = gl.getUniformLocation(gl.h.program.get(), location);
                    gl.h._uniform_map[location] = location_i;
                }

            // location_i = gl.getUniformLocation(gl.h.program.get(), location);
        
                gl.uniform3fv(location_i, floats);

                gl.h.gpu_throws("after uniform3fv(" + location + ", ...)");
            },

            uniform3iv: (location, ints ) => {
                gl.h.gpu_throws("before uniform3iv(" + location + ", ...)");
        
                var location_i;
                if (location in gl.h._uniform_map) {
                    location_i = gl.h._uniform_map[location];
                } else {
                    location_i = gl.getUniformLocation(gl.h.program.get(), location);
                    gl.h._uniform_map[location] = location_i;
                }

            // location_i = gl.getUniformLocation(gl.h.program.get(), location);
        
                gl.uniform3iv(location_i, ints);

                gl.h.gpu_throws("after uniform3iv(" + location + ", ...)");
            },


            uniform1iv: (location, ints ) => {
                gl.h.gpu_throws("before uniform1iv(" + location + ", ...)");

                //var gl = this.gl;
        
                var location_i;
                if (location in gl.h._uniform_map) {
                    location_i = gl.h._uniform_map[location];
                } else {
                    location_i = gl.getUniformLocation(gl.h.program.get(), location);
                    gl.h._uniform_map[location] = location_i;
                }

            // location_i = gl.getUniformLocation(gl.h.program.get(), location);
        
                gl.uniform1iv(location_i, ints);

                gl.h.gpu_throws("before uniform1iv(" + location + ", ...)");
            },

            uniform1i: (location, i ) => {
                gl.h.gpu_throws("before uniform1i(" + location + ", " + i + ")");
        
                var location_i;
                if (location in gl.h._uniform_map) {
                    location_i = gl.h._uniform_map[location];
                } else {
                    location_i = gl.getUniformLocation(gl.h.program.get(), location);
                    gl.h._uniform_map[location] = location_i;
                }

            // location_i = gl.getUniformLocation(program, location);
        
                gl.uniform1i(location_i, i);

                gl.h.gpu_throws("after uniform1i(" + location + ", " + i + ")");
            },

            // parameters: { 
            //    attrib_name or attrib_loc, 
            //    component_count, 
            //    component_type, normalized = false (if component_type is (half) float), 
            //    stride = 0, 
            //    offset = 0, 
            //    source_buffer (a vbo) or source_array (a Float32Array)
            //  }
            vertexAttribute: ( vao, parameters) => {
                gl.h.gpu_throws("before vertexAttribute(" +  vao + ", ...)");
                
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
                        param.attrib_loc = gl.getAttribLocation(gl.h.program.get(), param.attrib_name);
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

                gl.h.gpu_throws("after vertexAttribute(" +  vao + ", ...)");
            },
        }, 

        image:(filename) => new Promise((resolve, reject) => {
            let image = new Image();
            image.src = filename;
            image.onload=() => {
                resolve(image);
            }
            setTimeout(function() {
                reject("gl.h.image('" + filename + ") failed. Timeout: 10 seconds.")
            }, 10*1000);
        }),

        // loads image file, promises texture object from GPU
        send_image: (image) => {
            gl.h.gpu_throws("before send_image(...)");

            gl.activeTexture(gl.TEXTURE0);
            let texture = gl.createTexture();
            gl.bindTexture( gl.TEXTURE_2D, texture );
            
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
                gl.RGB, gl.UNSIGNED_BYTE, image );

            gl.generateMipmap( gl.TEXTURE_2D );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                            gl.NEAREST_MIPMAP_NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

            gl.h.gpu_throws("after await send_image(...) => " + texture);

            return texture;
        } 
    }    

    return gl;
}

define({
    createContext: createContext,
});