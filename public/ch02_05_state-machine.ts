import { createCanvasWebGL2 } from "./util/createCanvasWebGL2";
import { loadTextFile } from "./util/loadTextFile";
import { mat4 } from "gl-matrix";

const initBuffers = (
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    indices: Uint16Array,
    vertexPosition: number,
) => {
    // setup VAO
    const vertexArrayObject = gl.createVertexArray();
    if (vertexArrayObject === null) {
        throw new Error("could not create vertexArrayObject");
    }
    gl.bindVertexArray(vertexArrayObject);

    // setup VBO
    const vertexBuffer = gl.createBuffer();
    if (vertexBuffer === null) {
        throw new Error("could not create buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Provide instructions for VAO to use data later in draw
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
    if (gl.getError() !== gl.NO_ERROR) {
        throw new Error("could not enable vertexAttribArray");
    }

    // setup IBO
    const indexBuffer = gl.createBuffer();
    if (indexBuffer === null) {
        throw new Error("could not create buffer");
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const vboName = vertexBuffer === gl.getParameter(gl.ARRAY_BUFFER_BINDING) ? "coneVertexBuffer" : undefined;
    const iboName = indexBuffer === gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) ? "coneIndexBuffer" : undefined;
    const vboSize = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) as GLint;
    const vboUsage = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE) as GLenum;

    const iboSize = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE) as GLint;
    const iboUsage = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_USAGE) as GLenum;

    let isVerticesVbo = false;
    try {
        isVerticesVbo = gl.isBuffer(vertices);
    } catch (error) {
        isVerticesVbo = false;
    }

    const isConeVertexBufferVbo = gl.isBuffer(vertexBuffer);

    // clean up
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return {
        vertexBuffer,
        indexBuffer,
        vertexArrayObject,
        info: { vboName, iboName, vboSize, vboUsage, iboSize, iboUsage, isVerticesVbo, isConeVertexBufferVbo },
    };
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

    const vertexSource = await loadTextFile("./ch02_05_state-machine.vert");
    const vertexShader = loadShader(gl, "vertex", vertexSource);
    gl.attachShader(program, vertexShader);

    const fragmentSource = await loadTextFile("./ch02_05_state-machine.frag");
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
    indices: Uint16Array;
    indexBuffer: WebGLBuffer;
    vertexArrayObject: WebGLVertexArrayObject;
    aVertexPosition: number;
    projectionMatrix: mat4;
    modelViewMatrix: mat4;
    uProjectionMatrix: WebGLUniformLocation;
    uModelViewMatrix: WebGLUniformLocation;
}

const draw = (gl: WebGL2RenderingContext, data: Data) => {
    // clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // We will discuss these operations in later chapters
    mat4.perspective(data.projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);
    mat4.identity(data.modelViewMatrix);
    mat4.translate(data.modelViewMatrix, data.modelViewMatrix, [0, 0, -5]);

    gl.uniformMatrix4fv(data.uProjectionMatrix, false, data.projectionMatrix);
    gl.uniformMatrix4fv(data.uModelViewMatrix, false, data.modelViewMatrix);

    // bind the VAO
    gl.bindVertexArray(data.vertexArrayObject);

    // bind IBO
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.indexBuffer);

    // draw using triangle primitives
    gl.drawElements(gl.LINE_LOOP, data.indices.length, gl.UNSIGNED_SHORT, 0);

    // clean up
    gl.bindVertexArray(null);
};

const main = async () => {
    const { canvas, gl } = createCanvasWebGL2(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);

    /* eslint-disable no-multi-spaces */
    // prettier-ignore
    const vertices = new Float32Array([
         1.5, 0, 0,
        -1.5, 1, 0,
        -1.5, 0.809017, 0.587785,
        -1.5, 0.309017, 0.951057,
        -1.5, -0.309017, 0.951057,
        -1.5, -0.809017, 0.587785,
        -1.5, -1, 0,
        -1.5, -0.809017, -0.587785,
        -1.5, -0.309017, -0.951057,
        -1.5, 0.309017, -0.951057,
        -1.5, 0.809017, -0.587785,
    ]);

    // prettier-ignore
    const indices = new Uint16Array([
        0, 1, 2, // 1
        0, 2, 3, // 2
        0, 3, 4,
        0, 4, 5,
        0, 5, 6, 
        0, 6, 7,
        0, 7, 8,
        0, 8, 9,
        0, 9, 10,
        0, 10, 1
    ]);
    /* eslint-enable no-multi-spaces */

    const program = await initProgram(gl);

    const aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    const uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");
    if (uProjectionMatrix === null) {
        throw new Error("Projection Matrix is null");
    }
    const uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
    if (uModelViewMatrix === null) {
        throw new Error("Model View Matrix is null");
    }
    const buffers = initBuffers(gl, vertices, indices, aVertexPosition);

    const data: Data = {
        vertices,
        indices,
        ...buffers,
        aVertexPosition,
        projectionMatrix: mat4.create(),
        uProjectionMatrix,
        modelViewMatrix: mat4.create(),
        uModelViewMatrix,
    };

    gl.clearColor(0, 0, 0, 1.0);
    draw(gl, data);

    const stateEl = document.createElement("textArea") as HTMLTextAreaElement;
    stateEl.cols = 40;
    stateEl.rows = 20;
    stateEl.textContent = JSON.stringify(
        {
            vboName: buffers.info.vboName,
            iboName: buffers.info.iboName,
            vboSize: buffers.info.vboSize,
            vboUsage: buffers.info.vboUsage,
            iboSize: buffers.info.iboSize,
            iboUsage: buffers.info.iboUsage,
            isVerticesVbo: buffers.info.isVerticesVbo ? "Yes" : "No",
            isConeVertexBufferVbo: buffers.info.isConeVertexBufferVbo ? "Yes" : "No",
        },
        null,
        4,
    );
    document.body.appendChild(stateEl);
};

window.onload = main;
