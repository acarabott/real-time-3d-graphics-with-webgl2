import { createCanvasWebGL2 } from "./util/createCanvasWebGL2";
import { loadTextFile } from "./util/loadTextFile";

const initBuffers = (gl: WebGL2RenderingContext, vertices: Float32Array) => {
    // setup VBO
    const vertexBuffer = gl.createBuffer();
    if (vertexBuffer === null) {
        throw new Error("could not create buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return { vertexBuffer };
};

function loadShader(gl: WebGL2RenderingContext, type: "vertex" | "fragment", source: string) {
    const shader = gl.createShader({ vertex: gl.VERTEX_SHADER, fragment: gl.FRAGMENT_SHADER }[type]);
    if (shader === null) {
        throw new Error(`could not create ${type} shader`);
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? `Could not compile ${type} shader`);
    }

    return shader;
}

const initProgram = async (gl: WebGL2RenderingContext) => {
    const program = gl.createProgram();
    if (program === null) {
        throw new Error("could not create gl program");
    }

    const vertexSource = await loadTextFile("./ch02_02_square-arrays.vert");
    const vertexShader = loadShader(gl, "vertex", vertexSource);
    gl.attachShader(program, vertexShader);

    const fragmentSource = await loadTextFile("./ch02_02_square-arrays.frag");
    const fragmentShader = loadShader(gl, "fragment", fragmentSource);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const didLink = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
    if (!didLink) {
        throw new Error("could not link gl program");
    }

    gl.useProgram(program);

    return program;
};

interface Data {
    vertices: Float32Array;
    vertexBuffer: WebGLBuffer;
    vertexPosition: ReturnType<WebGL2RenderingContext["getAttribLocation"]>;
}

const draw = (gl: WebGL2RenderingContext, data: Data) => {
    // clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // use buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, data.vertexBuffer);
    gl.vertexAttribPointer(data.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(data.vertexPosition);

    // draw using triangle primitives
    gl.drawArrays(gl.TRIANGLES, 0, data.vertices.length / 3);

    // clean up
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

const main = async () => {
    const { canvas, gl } = createCanvasWebGL2(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);

    const top = 0.5;
    const bottom = -0.5;
    const left = -0.5;
    const right = 0.5;
    const topLeft = [left, top, 0.0];
    const botLeft = [left, bottom, 0.0];
    const botRight = [right, bottom, 0.0];
    const topRight = [right, top, 0.0];

    // prettier-ignore
    const vertices = new Float32Array([
        ...topLeft, ...botLeft, ...topRight,
        ...topRight, ...botLeft, ...botRight
    ]);

    const buffers = initBuffers(gl, vertices);

    const program = await initProgram(gl);

    const data: Data = {
        vertices,
        ...buffers,
        vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
    };

    gl.clearColor(0, 0, 0, 1.0);
    draw(gl, data);
};

window.onload = main;
