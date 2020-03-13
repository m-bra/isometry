var gl_4,
    canvas_5,
    parameters_6 = { start_time: new Date().getTime() },
    uniforms_7 = { time: [parameters_6.start_time - parameters_6.start_time], resolution: [0, 0] };
require(["glh", "text!vertex-shader.glsl", "text!fragment-shader.glsl"], function (glh_8, vertex_shader_9, fragment_shader_10) {
  var buffer_11,
      vao_12,
      vertex_shader_9,
      fragment_shader_10,
      currentProgram_15,
      vertex_position_16 = 0;
  canvas_5 = document.querySelector("canvas");
  gl_4 = glh_8.createContext(canvas_5);
  console.log("hello, world!");
  init();
  animate();
  function init() {
    buffer_11 = gl_4.createBuffer();
    gl_4.bindBuffer(gl_4.ARRAY_BUFFER, buffer_11);
    gl_4.bufferData(gl_4.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl_4.STATIC_DRAW);
    vao_12 = gl_4.createVertexArray();
    gl_4.bindVertexArray(vao_12);
    gl_4.enableVertexAttribArray(vertex_position_16);
    currentProgram_15 = gl_4.h.createProgramFromShaders(vertex_shader_9, fragment_shader_10);
  }
  function animate() {
    resizeCanvas();
    render();
    requestAnimationFrame(animate);
  }
  function render() {
    if (!currentProgram_15) return;
    uniforms_7.time[0] = (new Date().getTime() - parameters_6.start_time) / 1e3;
    gl_4.clear(gl_4.COLOR_BUFFER_BIT | gl_4.DEPTH_BUFFER_BIT);
    gl_4.useProgram(currentProgram_15);
    gl_4.h.send_uniforms(currentProgram_15, uniforms_7);
    gl_4.bindVertexArray(vao_12);
    gl_4.drawArrays(gl_4.TRIANGLES, 0, 6);
  }
});
function resizeCanvas(event_17) {
  if (canvas_5.width != canvas_5.clientWidth || canvas_5.height != canvas_5.clientHeight) {
    canvas_5.width = canvas_5.clientWidth;
    canvas_5.height = canvas_5.clientHeight;
    uniforms_7.resolution[0] = canvas_5.width;
    uniforms_7.resolution[1] = canvas_5.height;
    gl_4.viewport(0, 0, canvas_5.width, canvas_5.height);
  }
}