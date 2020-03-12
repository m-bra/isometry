var gl;

function createContext(canvas) {
    if (gl) throw "already created gl context";

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch( error ) { throw error; }
    
    if ( !gl ) {
        throw "cannot create webgl context";
    }

    gl.h = {
        gl: gl,
        createProgramFromShaders: (vertex, fragment) => {
            //var gl = this.gl;
            var program = gl.createProgram();
    
            var vs = gl.h.createShader( vertex, gl.VERTEX_SHADER );
            var fs = gl.h.createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );
    
            if ( vs == null || fs == null ) throw "cannot create vertex and/or fragment shader";
    
            gl.attachShader( program, vs );
            gl.attachShader( program, fs );
    
            gl.deleteShader( vs );
            gl.deleteShader( fs );
    
            gl.linkProgram( program );
    
            if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
    
                throw ( "ERROR:\n" +
                "VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
                "ERROR: " + gl.getError() + "\n\n" +
                "- Vertex Shader -\n" + vertex + "\n\n" +
                "- Fragment Shader -\n" + fragment );
    
            }
    
            return program;
        },
    
        createShader: ( src, type ) => {
            //var gl = this.gl;
            var shader = gl.createShader( type );
        
            gl.shaderSource( shader, src );
            gl.compileShader( shader );
        
            if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        
                throw ( ( type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT" ) + " SHADER:\n" + gl.getShaderInfoLog( shader ) );
        
            }
        
            return shader;
        
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
        }
    }

    

    return gl;
}

define({
    createContext: createContext,
});