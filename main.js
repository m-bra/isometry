
async function main(canvas) {
    // the user enters the local ip given on the phone to this window:

    if (false) {
        const ip = prompt("Please enter the IP-Adress given on your mobile input device.", "123.456.789.123");
        // that address does not have to be an ip-adress, but also any url.
        const url = ip;
        const connection = new WebSocket(url);

        connection.onerror = error => {
            console.log(`WebSocket error: ${error}`)
            alert(`WebSocket error: ${error}`)
        };

        // a connection is coming in.
        connection.onopen = () => {
            // In general, the connection must give any prompt I make to the user, and deliver me the correct result.
            connection.send('jung_year = prompt("Was C. G. Jung born in 1875 or in 1885?")');
            // the correct answer also implies a bit of intelligence, so either a human or a maintained bot
        };

        // a message is coming in.
        connection.onmessage = event => {
            const message = event.data;
            // this is the answer, it has the form ":var:c_ident = :answer:c_string_literal"
            // i want to process this answer with swirl.
            // an http swirl service is running at reqf.cf.
        }

    }

    let gl = (await load("gl.h.js")).createContext(canvas);
    gl.clearColor(0, 0, 0, 1);

    let program = gl.h.createProgram({sources: {
        vertexShader: await load("text!shaders/current/vertex.glsl"),
        fragmentShader: await load("text!shaders/current/fragment.glsl"),
    }});
    gl.useProgram(program);

    let thing = gl.createVertexArray();

    let texture = await gl.h.send_image("image.jpg");

    let forms_count = 50 * 50;
    let forms_per_line = 51;
    gl.h.uniform1i(program, "forms_count", forms_count);
    gl.h.uniform1i(program, "forms_per_line", forms_per_line);


    let colors = [];
    if (localStorage['colors'])
        colors = JSON.parse(localStorage['colors']);

    window.onbeforeunload = function(){
        localStorage['colors'] = JSON.stringify(colors);
    }

    for (let i = 0; i < forms_count; ++i) {
        if (Math.random() > 0.5) {
            colors.push(0.6);
            colors.push(0.3);
            colors.push(0.3);
        } else {
            colors.push(0.6);
            colors.push(0.6);
            colors.push(0.3);
        }
    }

    let selcolor = forms_count - 50;

    ////////////////
    // DRAW
    ////////////////

    var start = null;
    let uniforms = {
        camzoom: 1.0,
        campos: [0.0, 0.0]
    };

    function frame(timestamp) {
        if (!start)
        start = timestamp;
        var delta_time = timestamp - start;

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.h.send_uniforms(program, {
            delta_time: [delta_time / 1000],
            time: [timestamp / 1000],
            resolution: [canvas.width, canvas.height],
        });

        gl.h.send_uniforms(program, uniforms);

        gl.h.uniform1i(program, "selcolor", selcolor);


        gl.activeTexture(GL_TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.bindVertexArray(thing);
        // view vertex.glsl -> 2 * 3 * 3 parts per form.
        gl.drawArrays(gl.TRIANGLES, 0, forms_count * 2 * 3 * 3);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);

    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "e":
                console.log(localStorage['colors']);
                break;
            case "ArrowLeft":
                selcolor--;
                break;
            case "ArrowRight":
                selcolor++;
                break;
            case "ArrowUp":
                selcolor += forms_per_line;
                break;
            case "ArrowDown":
                selcolor -= forms_per_line;
                break;
            case "w":
                uniforms.campos.y += 1.0;
                break;
            case "a":
                uniforms.campos.x -= 1.0;
                break;
            case "s":
                uniforms.campos.y -= 1.0;
                break;
            case "d":
                uniforms.campos.x += 1.0;
                break;
            case "e":
                uniforms.camzoom *= 2.0;
                break;
            case "f":
                uniforms.camzoom /= 2.0;
                break;
            case "b":
                colors[selcolor * 3 + 0] = .2;
                colors[selcolor * 3 + 1] = .6;
                colors[selcolor * 3 + 2] = .8;
                break;
            case "x":
                colors[selcolor * 3 + 0] = .6;
                colors[selcolor * 3 + 1] = .2;
                colors[selcolor * 3 + 2] = .8;
                break;
            case "c":
                colors[selcolor * 3 + 0] = .6;
                colors[selcolor * 3 + 1] = .3;
                colors[selcolor * 3 + 2] = .3;
                break;
            case "v":
                colors[selcolor * 3 + 0] = .6;
                colors[selcolor * 3 + 1] = .6;
                colors[selcolor * 3 + 2] = .3;
                break;
        }
        gl.h.uniform3fv(program, "colors", colors);
    });
}

function repeat_3fv(x, y, z, count) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(x);
        arr.push(y);
        arr.push(z);
    }
    return arr;
}

function repeat_1iv(x, count) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(x);
    }
    return arr;
}
